use legal_invoice
SELECT id, email, password_hash FROM users;
DELETE FROM users WHERE email = 'admin@test.com'
\\pw:admin123legal_invoice

CREATE TABLE invoice_items (
id CHAR(36) PRIMARY KEY,
invoice_id CHAR(36) NOT NULL,
description VARCHAR(255) NOT NULL,
quantity INT NOT NULL,
unit_price DECIMAL(14,2) NOT NULL,
subtotal DECIMAL(14,2) NOT NULL,

CONSTRAINT fk_items_invoice
FOREIGN KEY (invoice_id) REFERENCES invoices(id)
ON DELETE CASCADE,

CONSTRAINT chk_quantity_positive
CHECK (quantity > 0),

CONSTRAINT chk_price_positive
CHECK (unit_price > 0),

CONSTRAINT chk_subtotal_positive
CHECK (subtotal >= 0)
);
