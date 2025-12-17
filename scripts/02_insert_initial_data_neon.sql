-- Inserir usuária Pamela Gonçalves com PIN 191018
INSERT INTO usuarios (nome, pin) 
VALUES ('Pamela Gonçalves', '191018')
ON CONFLICT (pin) DO NOTHING;
