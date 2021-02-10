-- Up

PRAGMA foreign_keys=OFF;

-- Simple changes adding gall descriptors per #75
INSERT INTO location (id, location, description) VALUES (NULL, 'leaf edge', '');
INSERT INTO texture (id, texture, description) VALUES (NULL, 'erineum', '');
INSERT INTO color (id, color) VALUES (NULL, 'green');

PRAGMA foreign_keys=ON;

--------------------------------------------------------------
-- Down
PRAGMA foreign_keys=OFF;

DELETE FROM location WHERE location = 'leaf edge';
DELETE FROM texture WHERE texture = 'erineum';
DELETE FROM color WHERE color = 'green';

PRAGMA foreign_keys=ON;
