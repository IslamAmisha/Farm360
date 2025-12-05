INSERT INTO district (id, name) VALUES
(1, 'Kolkata'),
(2, 'Howrah'),
(3, 'Hooghly'),
(4, 'Nadia'),
(5, 'Murshidabad'),
(6, 'North 24 Parganas'),
(7, 'South 24 Parganas'),
(8, 'Paschim Medinipur');


INSERT INTO block (id, name, district_id) VALUES
-- Kolkata
(1, 'Burrabazar', 1),
(2, 'Behala', 1),

-- Howrah
(3, 'Bally Jagachha', 2),
(4, 'Uluberia', 2),

-- Hooghly
(5, 'Chinsurah', 3),
(6, 'Serampore', 3),

-- Nadia
(7, 'Krishnanagar', 4),
(8, 'Kalyani', 4),

-- Murshidabad
(9, 'Berhampore', 5),
(10, 'Domkal', 5),

-- North 24 Parganas
(11, 'Barasat', 6),
(12, 'Bongaon', 6),

-- South 24 Parganas
(13, 'Canning', 7),
(14, 'Diamond Harbour', 7),

-- Paschim Medinipur
(15, 'Kharagpur', 8),
(16, 'Ghatal', 8);


INSERT INTO city_table (id, name, block_id) VALUES
-- Kolkata Blocks
(1, 'Park Street', 1),
(2, 'Bhowanipore', 2),
(3, 'Tollygunge', 2),

-- Howrah
(4, 'Shibpur', 3),
(5, 'Uluberia Town', 4),

-- Hooghly
(6, 'Chinsurah Town', 5),
(7, 'Serampore Town', 6),

-- Nadia
(8, 'Krishnanagar Town', 7),
(9, 'Kalyani Township', 8),

-- Murshidabad
(10, 'Berhampore Town', 9),
(11, 'Domkal Town', 10),

-- North 24 Parganas
(12, 'Barasat Town', 11),
(13, 'Bongaon Town', 12),

-- South 24 Parganas
(14, 'Canning Town', 13),
(15, 'Diamond Harbour Town', 14),

-- Paschim Medinipur
(16, 'Kharagpur Town', 15),
(17, 'Ghatal Town', 16);


INSERT INTO Crop_Table (id, name) VALUES
(1, 'Rice'),
(2, 'Wheat'),
(3, 'Potato'),
(4, 'Tomato'),
(5, 'Onion'),
(6, 'Mustard'),
(7, 'Jute'),
(8, 'Sugarcane'),
(9, 'Maize'),
(10, 'Green Peas');

INSERT INTO crop_sub_category (id, name, crop_id) VALUES
-- RICE VARIETIES
(1, 'Basmati', 1),
(2, 'Swarna', 1),
(3, 'IR64', 1),
(4, 'Gobindobhog', 1),

-- WHEAT
(5, 'Lokwan Wheat', 2),
(6, 'Sharbati Wheat', 2),

-- POTATO
(7, 'Jyoti Potato', 3),
(8, 'Chandramukhi Potato', 3),
(9, 'Kufri Pukhraj', 3),

-- TOMATO
(10, 'Hybrid Tomato', 4),
(11, 'Desi Tomato', 4),

-- ONION
(12, 'Red Onion', 5),
(13, 'White Onion', 5),

-- MUSTARD
(14, 'Yellow Mustard', 6),
(15, 'Black Mustard', 6),

-- JUTE
(16, 'Tossa Jute', 7),
(17, 'White Jute', 7),

-- SUGARCANE
(18, 'CO 0238', 8),
(19, 'BO 91', 8),

-- MAIZE
(20, 'Hybrid Maize', 9),
(21, 'Sweet Corn', 9),

-- GREEN PEAS
(22, 'Arkel Peas', 10),
(23, 'Bonville Peas', 10);
