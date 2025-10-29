const API_URL = 'https://retoolapi.dev/57fQrx/data';

    
 export   async function getProducts() {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`);
        return await res.json();
    }

  export  async function createProduct(product) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Error al crear el producto.');
        return await response.json();
    }


   export async function deleteProduct(id) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el producto.');
        return response;
    }
    

   export async function updateProduct(id, product) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Error al actualizar el producto.');
        return await response.json();
    }
    