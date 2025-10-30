import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../Services/ServiceProductos.js';

document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.querySelector('table tbody');
    const productForm = document.getElementById('productForm');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const lblModal = document.getElementById('productModalLabel');
    const btnAdd = document.getElementById('openModalBtn');

    const nombreProductoInput = document.getElementById('nombreProducto');
    const categoriaProductoInput = document.getElementById('categoriaProducto');
    const precioProductoInput = document.getElementById('precioProducto');
    const stockProductoInput = document.getElementById('stockProducto');
    const descripcionProductoInput = document.getElementById('descripcionProducto');

    init();

    async function loadProducts() {

        try {
            const products = await getProducts();
            tableBody.innerHTML = "";

            if (!products || products.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Actualmente no hay productos</td></tr>';
                return;
            }

            products.forEach((prod) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${prod.id}</td>
                    <td>${prod.nombreProducto}</td>
                    <td>${prod.categoriaProducto}</td>
                    <td>${prod.descripcionProducto || ''}</td>
                    <td>$${parseFloat(prod.precioProducto).toFixed(2)}</td>
                    <td>${prod.stockProducto}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </td>
                `;

                tr.querySelector(".edit-btn").addEventListener("click", () => {
                    productForm.productId.value = prod.id;
                    nombreProductoInput.value = prod.nombreProducto;
                    categoriaProductoInput.value = prod.categoriaProducto;
                    precioProductoInput.value = prod.precioProducto;
                    stockProductoInput.value = prod.stockProducto;
                    descripcionProductoInput.value = prod.descripcionProducto;

                    lblModal.textContent = "Editar Producto";
                    productModal.show();
                });

                tr.querySelector(".delete-btn").addEventListener('click', () => {
                    if (confirm("¿Desea eliminar este producto?")) {
                        deleteProduct(prod.id)
                            .then(loadProducts)
                            .catch(err => {
                                console.error("Error al eliminar producto: ", err);
                                alert("Hubo un error al eliminar el registro.");
                            });
                    }
                });

                tableBody.appendChild(tr);
            });
        } catch (err) {
            console.error("Error cargando productos: ", err);
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error al cargar datos. Ver consola.</td></tr>';
        }
    }

    function init() {
        loadProducts();
    }

    btnAdd.addEventListener('click', () => {
        productForm.reset();
        productForm.productId.value = '';
        lblModal.textContent = 'Agregar Producto';
        productModal.show();
    });

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = productForm.productId.value;
        const data = {
            nombreProducto: nombreProductoInput.value.trim(),
            categoriaProducto: categoriaProductoInput.value.trim(),
            precioProducto: precioProductoInput.value.trim(),
            stockProducto: stockProductoInput.value.trim(),
            descripcionProducto: descripcionProductoInput.value.trim()
        };
        
        const precio = parseFloat(data.precioProducto);
        const stock = parseInt(data.stockProducto);
        
        if (!data.nombreProducto || !data.categoriaProducto || isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
             alert('Completa todos los campos correctamente. Asegúrate que Nombre, Categoría y Descripción no estén vacíos, que el Precio sea positivo y el Stock no sea negativo.');
             return;
        }
        
        data.precioProducto = precio;
        data.stockProducto = stock;


        try {
            if (id) {
                await updateProduct(id, data);
                alert("Producto actualizado correctamente");
            } else {
                await createProduct(data);
                alert("Producto agregado correctamente");
            }

            productForm.reset();
            productModal.hide();
            await loadProducts();
        } catch (err) {
            console.error("Error en la operación: ", err);
            alert("Hubo un error al guardar/actualizar el producto.");
        }
    });

});