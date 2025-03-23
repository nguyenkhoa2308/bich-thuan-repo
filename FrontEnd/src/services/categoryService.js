import httpRequest from '~/utils/httpRequest';

export const getCategories = async () => {
    const response = await httpRequest.get('categories');
    return response;
};

export const addCategory = async (name, displayName) => {
    const response = await httpRequest.post('categories/add', { name, displayName });
    console.log(response);

    return response;
};

export const updateCategory = async (id, name, displayName) => {
    const { data } = await httpRequest.put(`categories/${id}`, { name, displayName });
    return data;
};

export const deleteCategory = async (id) => {
    await httpRequest.delete(`categories/${id}`);
};
