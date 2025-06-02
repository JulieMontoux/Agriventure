import { useEffect, useRef, useState } from "react";
import {
  DataTable
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Chip } from "primereact/chip";
import axios from "axios";
import '../assets/styles/addProducts.css';

// page d'ajouts de produits

type Product = {
  id: number;
  type: string;
  varieties: string;
  kg_price: number;
  euro_price: number;
  quantity: number;
  category: string;
  unit_weight: number; 
  img_path?: string;
};


export default function AddProduct() {
  const toast = useRef<Toast>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<null | Product>(null);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/productsTest/");
      setProducts(res.data);
      const uniqueCategories = Array.from(
        new Set(res.data.map((p: Product) => p.category).filter(Boolean))
      );
      setCategories(uniqueCategories);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Chargement des produits impossible",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const category = newCategory.trim() !== "" ? newCategory.trim() : newProduct.category;

    if (!newProduct.type || !newProduct.varieties || !category) {
      toast.current?.show({
        severity: "warn",
        summary: "Champs manquants",
        detail: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    if (!imageFile || !imageFile.name.endsWith(".png")) {
      toast.current?.show({
        severity: "warn",
        summary: "Image manquante",
        detail: "Merci de fournir une image .png",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/productsTest/", {
        ...newProduct,
        category,
        img_path: "",
      });

      const productId = res.data.id;
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("product_id", productId);

      await axios.post("http://localhost:8000/productsTest/upload-image/", formData);

      toast.current?.show({
        severity: "success",
        summary: "Produit ajouté",
        detail: "Produit ajouté avec succès",
      });

      setNewProduct({});
      setNewCategory("");
      setImageFile(null);
      setAddProductDialog(false);
      fetchProducts();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Ajout du produit échoué",
      });
    }
  };

const handleUpdateProduct = async (product: Product) => {
  const updatedProduct = {
    ...product,
    euro_price: parseFloat((product.kg_price * (product.unit_weight || 0)).toFixed(2)),
  };

  try {
    await axios.put(`http://localhost:8000/productsTest/${product.id}`, updatedProduct);
    toast.current?.show({
      severity: "success",
      summary: "Produit modifié",
      detail: `Produit #${product.id} mis à jour`,
    });
    fetchProducts();
  } catch {
    toast.current?.show({
      severity: "error",
      summary: "Erreur",
      detail: "Mise à jour échouée",
    });
  }
};


  const handleUploadImage = async (productId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_id", productId.toString());

    try {
      await axios.post("http://localhost:8000/productsTest/upload-image/", formData);
      toast.current?.show({
        severity: "success",
        summary: "Image modifiée",
        detail: "Image mise à jour avec succès",
      });
      fetchProducts();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Upload échoué",
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      await axios.delete(`http://localhost:8000/productsTest/${product.id}`);
      toast.current?.show({
        severity: "success",
        summary: "Produit supprimé",
        detail: `Produit #${product.id} supprimé`,
      });
      fetchProducts();
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Suppression échouée",
      });
    } finally {
      setDeleteDialog(null);
    }
  };

  const stockBodyTemplate = (rowData: Product) => {
    const getSeverity = (quantity: number) => {
      if (quantity > 100) return "success";
      if (quantity > 50) return "warning";
      return "danger";
    };

    return <Tag value={rowData.quantity} severity={getSeverity(rowData.quantity)} />;
  };

  const priceBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-white">{rowData.kg_price.toFixed(2)}€/kg</span>
        <span className="text-sm text-gray-300">{rowData.euro_price.toFixed(2)}€/u</span>
      </div>
    );
  };

  const categoryBodyTemplate = (rowData: Product) => {
    return <Chip label={rowData.category} className="bg-blue-600 text-white" />;
  };

  const imageBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex align-items-center gap-2">
        <div className="w-8 h-8 rounded-full flex align-items-center justify-content-center">
          <i className="pi pi-image text-gray-300"></i>
        </div>
        <FileUpload
          mode="basic"
          accept=".png,.jpg,.jpeg"
          chooseLabel="Modifier"
          className="p-0"
          chooseOptions={{
            className: "p-button-text p-button-sm p-0 text-blue-400"
          }}
          customUpload
          uploadHandler={(e) => {
            const file = e.files[0];
            if (file) handleUploadImage(rowData.id, file);
          }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger p-button-sm"
          onClick={() => setDeleteDialog(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
      <div className="flex align-items-center gap-2">
        <h2 className="m-0 text-2xl font-bold text-white">Produits</h2>
        <Chip label={`${products.length} produits`} className="bg-gray-600 text-white" />
      </div>
      <div className="flex gap-2">
        <span className="p-input-icon-left">
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Rechercher..."
            className="w-full md:w-20rem"
          />
        </span>
        <Button
          label="Ajouter"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => setAddProductDialog(true)}
        />
      </div>
    </div>
  );

  return (
    <div className="p-3 md:p-6 ">
      <Toast ref={toast} />

      <div className="max-w-7xl mx-auto ">
        <div className="mb-6">
          <Button
            label="Retour"
            icon="pi pi-arrow-left"
            className="p-button-text text-white"
            onClick={() => console.log("Navigate to dashboard")}
          />
        </div>

        <div className="bg-transparent">
          <DataTable
            value={products}
            header={header}
            globalFilter={globalFilter}
            responsiveLayout="scroll"
            editMode="row"
            dataKey="id"
            onRowEditComplete={(e) => {
              const updatedProduct: Product = {
                ...e.newData,
                euro_price: parseFloat(
                  ((e.newData.unit_weight || 0) * (e.newData.kg_price || 0)).toFixed(2)
                ),
              };
              handleUpdateProduct(updatedProduct);
            }}

            className="transparent-table p-datatable-lg"
            emptyMessage="Aucun produit trouvé"

            >

            <Column 
              field="id" 
              header="ID" 
              sortable 
              className="w-16 text-white"
            />
            
            <Column
              field="type"
              header="Type"
              sortable
              editor={(options) => (
                <InputText 
                  value={options.value} 
                  onChange={(e) => options.editorCallback?.(e.target.value)}
                  className="w-full"
                />
              )}
              className="font-medium text-white"
            />
            
            <Column
              field="varieties"
              header="Variétés"
              editor={(options) => (
                <InputText 
                  value={options.value} 
                  onChange={(e) => options.editorCallback?.(e.target.value)}
                  className="w-full"
                />
              )}
              className="text-sm text-gray-300"
            />
            
            <Column
              header="Prix"
              body={priceBodyTemplate}
              className="w-32"
            />

            <Column
            field="unit_weight"
            header="Poids (kg/u)"
            editor={(options) => (
              <InputNumber
                value={options.value}
                onValueChange={(e) => {
                  const newWeight = e.value || 0;
                  options.editorCallback?.(newWeight);
                  handleUpdateProduct({
                    ...options.rowData,
                    unit_weight: newWeight,
                    euro_price: parseFloat((newWeight * options.rowData.kg_price).toFixed(2)),
                  });
                }}
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={2}
                className="w-full"
              />
            )}
            body={(rowData: Product) => (
              <span className="text-white">{rowData.unit_weight?.toFixed(2) || "0.00"} kg</span>
            )}
            className="w-24 text-white"
          />

            
            <Column
              field="quantity"
              header="Stock"
              body={stockBodyTemplate}
              editor={(options) => (
                <InputNumber 
                  value={options.value} 
                  onValueChange={(e) => options.editorCallback?.(e.value)}
                  className="w-full"
                />
              )}
              sortable
              className="w-24"
            />
            
            <Column
              field="category"
              header="Catégorie"
              body={categoryBodyTemplate}
              editor={(options) => (
                <Dropdown
                  value={options.value}
                  options={categories}
                  onChange={(e) => options.editorCallback?.(e.value)}
                  className="w-full"
                />
              )}
              sortable
            />
            
            <Column
              header="Image"
              body={imageBodyTemplate}
              className="w-32"
            />
            
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            />
            
            <Column
              header="Actions"
              body={actionBodyTemplate}
              exportable={false}
              className="w-24"
            />
          </DataTable>
        </div>
      </div>

      <Dialog
        visible={addProductDialog}
        style={{ width: "90vw", maxWidth: "600px" }}
        header="Ajouter un nouveau produit"
        modal
        className="p-fluid"
        onHide={() => {
          setAddProductDialog(false);
          setNewProduct({});
          setNewCategory("");
          setImageFile(null);
        }}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setAddProductDialog(false)}
            />
            <Button
              label="Ajouter"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleAddProduct}
            />
          </div>
        }
      >
        <div className="grid formgrid p-fluid">
          <div className="field col-12 md:col-6">
            <label htmlFor="type" className="font-semibold">
              Type <span className="text-red-500">*</span>
            </label>
            <InputText
              id="type"
              value={newProduct.type || ""}
              onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
              placeholder="Ex: Pomme"
              className="mt-1"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="varieties" className="font-semibold">
              Variétés <span className="text-red-500">*</span>
            </label>
            <InputText
              id="varieties"
              value={newProduct.varieties || ""}
              onChange={(e) => setNewProduct({ ...newProduct, varieties: e.target.value })}
              placeholder="Ex: Gala, Fuji"
              className="mt-1"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="kg_price" className="font-semibold">Prix au kg (€)</label>
            <InputNumber
              id="kg_price"
              value={newProduct.kg_price || 0}
              onValueChange={(e) => setNewProduct({ ...newProduct, kg_price: e.value || 0 })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              className="mt-1"
            />
          </div>

          <div className="field col-12 md:col-6">
          <label htmlFor="unit_weight" className="font-semibold">Poids unitaire (kg)</label>
          <InputNumber
            id="unit_weight"
            value={newProduct.unit_weight || 0}
            onValueChange={(e) => {
              const unitWeight = e.value || 0;
              const kgPrice = newProduct.kg_price || 0;
              const euroPrice = unitWeight * kgPrice;
              setNewProduct({
                ...newProduct,
                unit_weight: unitWeight,
                euro_price: parseFloat(euroPrice.toFixed(2))
              });
            }}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            className="mt-1"
          />
        </div>


          <div className="field col-12 md:col-6">
            <label htmlFor="euro_price" className="font-semibold">Prix &agrave; l&rsquo;unit&eacute; (&euro;)</label>
            <InputNumber
              id="euro_price"
              value={newProduct.euro_price || 0}
              onValueChange={(e) => setNewProduct({ ...newProduct, euro_price: e.value || 0 })}
              mode="decimal"
              minFractionDigits={2}
              maxFractionDigits={2}
              className="mt-1"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="quantity" className="font-semibold">Quantité en stock</label>
            <InputNumber
              id="quantity"
              value={newProduct.quantity || 0}
              onValueChange={(e) => setNewProduct({ ...newProduct, quantity: e.value || 0 })}
              className="mt-1"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="category" className="font-semibold">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="category"
              value={newProduct.category || ""}
              options={categories}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.value })}
              placeholder="Sélectionner une catégorie"
              className="mt-1"
            />
          </div>

          <Divider align="center" className="col-12">
            <span className="text-sm text-gray-500">OU</span>
          </Divider>

          <div className="field col-12">
            <label htmlFor="newCategory" className="font-semibold">Nouvelle catégorie</label>
            <InputText
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Créer une nouvelle catégorie"
              className="mt-1"
            />
          </div>

          <div className="field col-12">
            <label className="font-semibold">Image du produit</label>
            <div className="mt-1">
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {imageFile && (
              <small className="text-green-600 mt-1 block">
                ✓ {imageFile.name} sélectionné
              </small>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={!!deleteDialog}
        style={{ width: "450px" }}
        header="Confirmer la suppression"
        modal
        onHide={() => setDeleteDialog(null)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Annuler"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteDialog(null)}
            />
            <Button
              label="Supprimer"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => deleteDialog && handleDeleteProduct(deleteDialog)}
            />
          </div>
        }
      >
        <div className="flex align-items-center">
          <i className="pi pi-exclamation-triangle mr-3 text-2xl text-red-500" />
          <span>
            Êtes-vous sûr de vouloir supprimer le produit <strong>{deleteDialog?.type}</strong> ?
            <br />
            <small className="text-gray-500">Cette action est irr&eacute;versible.</small>
          </span>
        </div>
      </Dialog>
    </div>
  );
}