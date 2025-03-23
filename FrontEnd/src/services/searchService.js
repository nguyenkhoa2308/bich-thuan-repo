import httpRequest from '~/utils/httpRequest';

export const search = async (q, type = 'less') => {
    try {
        const response = await httpRequest.get(`products/search`, {
            params: {
                q,
                type,
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};
