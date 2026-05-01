-- Tabla whitelist_email
-- Almacena emails autorizados a registrarse en la plataforma.
-- La validación contra el flujo de registro se conectará en una segunda etapa.

CREATE TABLE IF NOT EXISTS whitelist_email (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    tipo_usuario    VARCHAR(30)  NOT NULL,
    estado          VARCHAR(20)  NOT NULL DEFAULT 'activo',
    cargado_por     VARCHAR(255),
    lote_id         UUID,
    observaciones   TEXT,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_whitelist_tipo_usuario
        CHECK (tipo_usuario IN ('desarrollador', 'gerente', 'institucion_educativa')),

    CONSTRAINT chk_whitelist_estado
        CHECK (estado IN ('activo', 'revocado', 'usado'))
);

CREATE INDEX IF NOT EXISTS idx_whitelist_email_estado   ON whitelist_email (estado);
CREATE INDEX IF NOT EXISTS idx_whitelist_email_lote     ON whitelist_email (lote_id);
CREATE INDEX IF NOT EXISTS idx_whitelist_email_tipo     ON whitelist_email (tipo_usuario);
