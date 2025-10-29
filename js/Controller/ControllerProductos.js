import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../Services/ServiceProductos.js';

document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.querySelector('table tbody');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const productForm = document.getElementById('productForm');
    const lblModal = document.getElementById('productModalLabel');
    const btnAdd = document.getElementById('openModalBtn');

    const nombreProductoInput = document.getElementById('nombreProducto');
    const categoriaProductoInput = document.getElementById('categoriaProducto');
    const precioProductoInput = document.getElementById('precioProducto');
    const stockProductoInput = document.getElementById('stockProducto');
    const descripcionProductoInput = document.getElementById('descripcionProducto');

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
                <td>$${parseFloat(producto.precioProducto).toFixed(2)}</td>
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
        clearValidationMessages();
        productModal.show();
    });

    function showValidationMessage(inputElement, message) {
        let errorDiv = inputElement.nextElementSibling;
        
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback-custom')) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('invalid-feedback-custom', 'text-danger', 'mt-1');
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        }
        
        inputElement.classList.add('is-invalid');
        errorDiv.textContent = message;
    }

    function clearValidationMessages() {
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback-custom').forEach(el => {
            el.remove();
        });
    }

    function validateForm(data) {
        let isValid = true;
        clearValidationMessages();

        if (data.nombreProducto.length < 3 || data.nombreProducto.length > 100) {
            showValidationMessage(nombreProductoInput, "El nombre debe tener entre 3 y 100 caracteres.");
            isValid = false;
        }

        if (data.categoriaProducto === "" || data.categoriaProducto === "Seleccione una categoría") {
            showValidationMessage(categoriaProductoInput, "Debe seleccionar una categoría.");
            isValid = false;
        }

        if (isNaN(data.precioProducto) || data.precioProducto <= 0) {
            showValidationMessage(precioProductoInput, "El precio debe ser un número positivo mayor a 0.");
            isValid = false;
        }

        if (isNaN(data.stockProducto) || !Number.isInteger(data.stockProducto) || data.stockProducto < 0) {
            showValidationMessage(stockProductoInput, "El stock debe ser un número entero no negativo.");
            isValid = false;
        }
        
        if (data.descripcionProducto.length < 10 || data.descripcionProducto.length > 500) {
             showValidationMessage(descripcionProductoInput, "La descripción debe tener entre 10 y 500 caracteres.");
             isValid = false;
         }

        return isValid;
    }

    productForm.addEventListener("submit", async e => {
        e.preventDefault();
        
        const id = productForm.productId.value;
        const nombreProducto = nombreProductoInput.value.trim();
        const categoriaProducto = categoriaProductoInput.value.trim();
        const precioProducto = parseFloat(precioProductoInput.value.trim());
        const stockProducto = parseInt(stockProductoInput.value.trim());
        const descripcionProducto = descripcionProductoInput.value.trim();

        const data = {nombreProducto, categoriaProducto, precioProducto, stockProducto, descripcionProducto};
        
        if (!validateForm(data)) {
            return;
        }
        
        try {
            if (id) {
                await updateProduct(id, data); 
                alert("Producto actualizado correctamente");
            } else {
                await createProduct(data); 
                alert("Producto agregado correctamente");
            }
            
            productForm.reset();
            clearValidationMessages();
            productModal.hide();
            loadProducts();
            
        } catch (error) {
            console.error("Error en la operación: ", error);
            alert(" Hubo un error al guardar/actualizar el producto.");
        }
    });
    
    async function editProduct(id) {
        try {
            const producto = await getProductById(id);
            if (!producto) {
                alert("Producto no encontrado.");
                return;
            }
            
            productForm.productId.value = producto.id;
            nombreProductoInput.value = producto.nombreProducto;
            categoriaProductoInput.value = producto.categoriaProducto;
            precioProductoInput.value = producto.precioProducto;
            stockProductoInput.value = producto.stockProducto;
            descripcionProductoInput.value = producto.descripcionProducto;
            
            lblModal.textContent = 'Editar Producto';
            clearValidationMessages();
            productModal.show();
        } catch (err) {
            console.error("Error al cargar producto para edición: ", err);
            alert("Hubo un error al cargar los datos del producto.");
        }
    }

    async function deleteProductHandler(id) {
        if (confirm("¿Estás seguro que deseas borrar este producto?")) {
            try {
                await deleteProduct(id); 
                alert(" El registro fue eliminado correctamente");
                loadProducts();
            } catch (error) {
                console.error("Error al eliminar: ", error);
                alert("Hubo un error al eliminar el registro.");
            }
        }
    }

});