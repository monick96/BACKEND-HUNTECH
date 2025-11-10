CREATE DATABASE huntechdb;

CREATE TABLE desarrollador (
  id VARCHAR(60),
  email VARCHAR(100),
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  descripcion VARCHAR(MAX),
  fecha_nacimiento VARCHAR(100),
  rol VARCHAR(255), -- crear y separar por coma x si hay varios
  skills VARCHAR(255), -- crear y separar por coma x si hay varios
  created_at VARCHAR(100)
);


CREATE TABLE proyecto (
  id VARCHAR(60) PRIMARY KEY,
  nombre VARCHAR(500),
  description VARCHAR(MAX),
  info_link VARCHAR(500),
  buscando_devs BIT NOT NULL,--1 o 0
  contratos VARCHAR(MAX), -- lista de IDs contratos separados por coma(asi lo podemos manejar x ahora)
  id_gerente VARCHAR(60),
  email_gerente VARCHAR(100)
);

CREATE TABLE gerente (
  id_gerente VARCHAR(60),
  id_proyecto VARCHAR(60),
  nombre VARCHAR(90),
  email VARCHAR(100),
  descripcion VARCHAR(MAX)
);

CREATE TABLE institucion_educativa (
  id VARCHAR(60),
  email VARCHAR(100),
  nombre VARCHAR(255)
);

CREATE TABLE carrera (
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(255),
  info_link VARCHAR(500),
  id_institucion_educativa VARCHAR(60),
  status VARCHAR(50),
);

CREATE TABLE carrera_x_desarrollador (
  id_desarrollador VARCHAR(60),
  id_carrera VARCHAR(60),
  start_date VARCHAR(100),
  end_date VARCHAR(100),
  isvalidated BIT NOT NULL -- valor debe ser 1 o 0
);

CREATE TABLE contrato (
  id INT IDENTITY(1,1) PRIMARY KEY,
  tipo VARCHAR(100),
  titulo VARCHAR(255),
  descripcion VARCHAR(MAX),
  tiene_postulaciones BIT, --1 o 0
  postulaciones VARCHAR(MAX), -- lista de emails separados por coma(para no crear otra tabla)
  esta_ocupado BIT, --1 o 0
  pasante_email VARCHAR(100),
  proyecto_id VARCHAR(60),
  start_date VARCHAR(100),
  end_date VARCHAR(100),
);

USE huntechdb;








