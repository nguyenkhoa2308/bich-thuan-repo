import httpRequest from '~/utils/httpRequest';

const register = async (email, password, firstName, lastName, gender, birthDate) => {
    try {
        const response = await httpRequest.post('/user/register', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            displayName: `${firstName} ${lastName}`,
            gender: gender,
            birthDate: birthDate,
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

const login = async (email, password) => {
    try {
        const response = await httpRequest.post('/user/login', {
            email,
            password,
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

export { register, login };
