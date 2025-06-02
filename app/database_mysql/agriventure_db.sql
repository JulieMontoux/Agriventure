SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `agriventure_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `companysettings`
--

CREATE TABLE `companysettings` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `companysettings`
--

INSERT INTO `companysettings` (`id`, `name`, `address`, `phone`, `email`, `logo_path`) VALUES
(1, 'EARL Villemur', '123 Rue des Fruits, 31340 Villemur-sur-Tarn', '05 61 XX XX XX', 'contact@earlvillemur.fr', 'src/assets/images/agriventure-logo.png');

-- --------------------------------------------------------

--
-- Structure de la table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `date` varchar(255) NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `invoicesettings`
--

CREATE TABLE `invoicesettings` (
  `id` int(11) NOT NULL,
  `payment_terms` varchar(255) NOT NULL,
  `delivery_time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `invoicesettings`
--

INSERT INTO `invoicesettings` (`id`, `payment_terms`, `delivery_time`) VALUES
(1, 'Paiement à la livraison', '2 jours ouvrés');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `products_ordered` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `order_type` varchar(255) NOT NULL,
  `total_price` int(11) NOT NULL,
  `ordered_by` varchar(255) NOT NULL,
  `ordered_at` datetime DEFAULT current_timestamp(),
  `total_weight` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `productstest`
--

CREATE TABLE `productstest` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `varieties` varchar(255) NOT NULL,
  `kg_price` int(11) NOT NULL,
  `euro_price` int(11) NOT NULL,
  `img_path` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `category` varchar(255) DEFAULT NULL,
  `unit_weight` float NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sellers`
--

CREATE TABLE `sellers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sellers`
--

INSERT INTO `sellers` (`id`, `name`, `birth_date`, `user_id`, `created_at`) VALUES
(2, 'james', '2025-05-15', 5, '2025-05-29 15:34:31');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `hashed_password`, `role`) VALUES
(1, 'admin', '$2b$12$RmpYfqHYB8uReObDJXTGyOGal8xRbAf0stFjXlnV5UG9G66lbdaGK', 'administrator'),
(5, 'james', '$2b$12$XYxZl4F/aSUVKHNxaM2m8ufzCJaB7rzKi6OF1md8ICdQJ05j4UF/C', 'vendor');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `companysettings`
--
ALTER TABLE `companysettings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_companysettings_id` (`id`),
  ADD KEY `ix_companysettings_email` (`email`),
  ADD KEY `ix_companysettings_address` (`address`),
  ADD KEY `ix_companysettings_name` (`name`),
  ADD KEY `ix_companysettings_logo_path` (`logo_path`),
  ADD KEY `ix_companysettings_phone` (`phone`);

--
-- Index pour la table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_expenses_id` (`id`),
  ADD KEY `ix_expenses_supplier` (`supplier`),
  ADD KEY `ix_expenses_amount` (`amount`),
  ADD KEY `ix_expenses_description` (`description`),
  ADD KEY `ix_expenses_date` (`date`),
  ADD KEY `ix_expenses_category` (`category`);

--
-- Index pour la table `invoicesettings`
--
ALTER TABLE `invoicesettings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_invoicesettings_delivery_time` (`delivery_time`),
  ADD KEY `ix_invoicesettings_id` (`id`),
  ADD KEY `ix_invoicesettings_payment_terms` (`payment_terms`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_orders_quantity` (`quantity`),
  ADD KEY `ix_orders_id` (`id`),
  ADD KEY `ix_orders_ordered_by` (`ordered_by`),
  ADD KEY `ix_orders_products_ordered` (`products_ordered`),
  ADD KEY `ix_orders_total_price` (`total_price`),
  ADD KEY `ix_orders_order_type` (`order_type`);

--
-- Index pour la table `productstest`
--
ALTER TABLE `productstest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_productstest_varieties` (`varieties`),
  ADD KEY `ix_productstest_type` (`type`),
  ADD KEY `ix_productstest_id` (`id`),
  ADD KEY `ix_productstest_euro_price` (`euro_price`),
  ADD KEY `ix_productstest_kg_price` (`kg_price`);

--
-- Index pour la table `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ix_sellers_id` (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_users_role` (`role`),
  ADD KEY `ix_users_username` (`username`),
  ADD KEY `ix_users_hashed_password` (`hashed_password`),
  ADD KEY `ix_users_id` (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `companysettings`
--
ALTER TABLE `companysettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `invoicesettings`
--
ALTER TABLE `invoicesettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT pour la table `productstest`
--
ALTER TABLE `productstest`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `sellers`
--
ALTER TABLE `sellers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `sellers`
--
ALTER TABLE `sellers`
  ADD CONSTRAINT `sellers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
