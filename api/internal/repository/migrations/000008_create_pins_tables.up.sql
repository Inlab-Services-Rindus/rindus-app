CREATE TABLE IF NOT EXISTS pins_category (
    id serial NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pins_category_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pins (
    id serial NOT NULL,
    event_date DATE NOT NULL,
    image_pin TEXT NOT NULL,
    pin_title VARCHAR(255) NOT NULL,
    pin_description TEXT NOT NULL,
    auto_assigned BOOLEAN DEFAULT false,
    category_id INTEGER NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pins_pkey PRIMARY KEY (id),
    CONSTRAINT pins_category_id_foreign FOREIGN KEY (category_id) REFERENCES pins_category(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_pins (
    employee_id INTEGER NOT NULL,
    pin_id INTEGER NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, pin_id),
    CONSTRAINT employee_pins_pin_id_foreign FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE
);
