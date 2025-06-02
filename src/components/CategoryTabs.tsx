import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

// composant pour filtrer par catégorie

type Props = {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  allProducts: {
    category: string;
    type: string;
  }[];
  showOnlyCategory?: boolean;
  showOnlyType?: boolean;
};

export default function CategoryTabs({
  selectedFilter,
  onFilterChange,
  allProducts,
  showOnlyCategory = false,
  showOnlyType = false
}: Props) {
  const toast = useRef<Toast>(null);

  const categoryOptions = Array.from(new Set(allProducts.map(p => p.category.toLowerCase())))
    .map(c => ({ label: capitalize(c), value: c }));

  const typeOptions = Array.from(new Set(allProducts.map(p => p.type.toLowerCase())))
    .map(t => ({ label: capitalize(t), value: t }));

  const handleChange = (value: string, label: string) => {
    onFilterChange(value);
    toast.current?.show({
      severity: 'info',
      summary: 'Filtre appliqué',
      detail: capitalize(label),
      life: 2000
    });
  };

  return (
    <div>
      <Toast ref={toast} />

      {!showOnlyType && (
        <Dropdown
          value={categoryOptions.find(c => c.value === selectedFilter) || null}
          options={[{ label: 'Toutes les catégories', value: 'all' }, ...categoryOptions]}
          onChange={(e: DropdownChangeEvent) => handleChange(e.value, e.value)}
          placeholder="Catégorie"
          className="w-full mb-2"
          style={{
            backgroundColor: '#2B2E3D',
            border: 'none',
            color: 'white',
            borderRadius: '8px'
          }}
        />
      )}

      {!showOnlyCategory && (
        <Dropdown
          value={typeOptions.find(t => t.value === selectedFilter) || null}
          options={[{ label: 'Tous les types', value: 'all' }, ...typeOptions]}
          onChange={(e: DropdownChangeEvent) => handleChange(e.value, e.value)}
          placeholder="Type"
          className="w-full"
          style={{
            backgroundColor: '#2B2E3D',
            border: 'none',
            color: 'white',
            borderRadius: '8px'
          }}
        />
      )}
    </div>
  );
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
