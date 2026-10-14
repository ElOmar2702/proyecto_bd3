const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.get("/Producto", (req, res) => {
  const sql = "SELECT * FROM Producto";
  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

app.post("/Producto", (req, res) => {
  const { nombre, precio, stock } = req.body;
  const sql = "INSERT INTO Producto (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

app.put("/Producto/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;
  const sql = "UPDATE Producto SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

app.delete("/Producto/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Producto WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

app.get("/Contactos", (req, res) => {
  const sql = "SELECT * FROM contactos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar contactos:", error);
      return res.status(500).json({ mensaje: "Error al consultar los contactos" });
    }
    res.json(resultados);
  });
});

app.post("/Contactos", (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;
  const sql = "INSERT INTO contactos (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
  const valores = [nombre, correo, asunto, mensaje];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar contacto:", error);
      return res.status(500).json({ mensaje: "Error al guardar el contacto" });
    }

    res.status(201).json({
      mensaje: "Contacto guardado correctamente",
      id: resultado.insertId,
    });
  });
});

app.delete("/Contactos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM contactos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar contacto:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el contacto" });
    }
    res.json({ mensaje: "Contacto eliminado correctamente" });
  });
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});