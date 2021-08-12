-- --------------------------------------------------------

--
-- Table structure for table `wp_amelia_children_to_services`
--

CREATE TABLE `wp_amelia_children_to_services` (
  `id` int(11) NOT NULL,
  `customerChildrenId` int(11) NOT NULL,
  `serviceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `wp_amelia_children_to_services`
--
ALTER TABLE `wp_amelia_children_to_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `wp_amelia_children_to_services`
--
ALTER TABLE `wp_amelia_children_to_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
