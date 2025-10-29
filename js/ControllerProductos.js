import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../js/ServiceProductos.js';

document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.querySelector('table tbody'); 
    const productModal = new bootstrap.Modal(document.getElementById('productModal')); 
    const productForm = document.getElementById('productForm'); 
    const lblModal = document.getElementById('productModalLabel');
    const btnAdd = document.getElementById('openModalBtn'); 

    loadProducts();

    async function getProductById(id) {
        const products = await getProducts();
        return products.find(product => parseInt(product.id) === parseInt(id)); 
    }

    function createTable(datos) {
        tableBody.innerHTML = "";

        if (!datos || datos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos disponibles</td></tr>';
            return;
        }

        datos.forEach(producto => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombreProducto}</td>
                <td>${producto.categoriaProducto}</td>
                <td>${producto.descripcionProducto || ''}</td>
                <td>${producto.precioProducto}</td>
                <td>${producto.stockProducto}</td>
                <td>
                    <button class="btn btn-sm btn-outline-secondary edit-btn">Editar</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">Eliminar</button>
                </td>
            `;

            tr.querySelector(".edit-btn").addEventListener("click", () => {
                editProduct(producto.id);
            });

            tr.querySelector(".delete-btn").addEventListener('click', () => {
                deleteProductHandler(producto.id);
            });

            tableBody.appendChild(tr);
        });
    }

    async function loadProducts() {
        try {
            const data = await getProducts(); 
            createTable(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error al cargar datos. Ver consola.</td></tr>';
        }
    }

    btnAdd.addEventListener("click", () => {
        productForm.reset();
        productForm.productId.value = ''; 
        lblModal.textContent = 'Nuevo Producto'; 
        productModal.show();
    });

    productForm.addEventListener("submit", async e => {
        e.preventDefault();
        
        const id = productForm.productId.value;
        const nombreProducto = productForm.nombreProducto.value.trim();
        const categoriaProducto = productForm.categoriaProducto.value.trim();
        const precioProducto = parseFloat(productForm.precioProducto.value.trim());
        const stockProducto = parseInt(productForm.stockProducto.value.trim());
        const descripcionProducto = productForm.descripcionProducto.value.trim();

        if (!nombreProducto || !categoriaProducto || isNaN(precioProducto) || isNaN(stockProducto) || !descripcionProducto) {
            alert("Complete todos los campos del producto correctamente.");
            return;
        }
        
        const data = {nombreProducto, categoriaProducto, precioProducto, stockProducto, descripcionProducto};

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
            loadProducts();
            
        } catch (error) {
            console.error("Error en la operación: ", error);
            alert("Hubo un error al guardar/actualizar el producto.");
        }
    });
    
    async function editProduct(id) {
        try {
            const producto = await getProductById(id);
            
            productForm.productId.value = producto.id;
            productForm.nombreProducto.value = producto.nombreProducto;
            productForm.categoriaProducto.value = producto.categoriaProducto;
            productForm.precioProducto.value = producto.precioProducto;
            productForm.stockProducto.value = producto.stockProducto;
            productForm.descripcionProducto.value = producto.descripcionProducto;
            
            lblModal.textContent = 'Editar Producto';
            productModal.show();
        } catch (err) {
            console.error("Error al cargar producto para edición: ", err);
        }
    }

    async function deleteProductHandler(id) {
        if (confirm("¿Estás seguro que deseas borrar este producto?")) {
            try {
                await deleteProduct(id); 
                alert("El registro fue eliminado correctamente");
                loadProducts();
            } catch (error) {
                console.error("Error al eliminar: ", error);
                alert("Hubo un error al eliminar el registro.");
            }
        }
    }

});