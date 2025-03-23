import { createContext, useContext, useState, useEffect } from 'react';

import httpRequest from '~/utils/httpRequest';

const AddressContext = createContext();

export function AddressProvider({ children }) {
    const [addresses, setAddresses] = useState([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            await getAddresses();
        };
        fetchAddresses();
    }, []);

    const getAddresses = async () => {
        try {
            const response = await httpRequest.get('/address');
            setAddresses(response?.addresses);
            // return res;
        } catch (error) {
            console.log(error);
        }
    };

    const createAddress = async (fullName, phone, city, district, ward, detailAddress, typeAddress, isDefault) => {
        try {
            const response = await httpRequest.post('/address/add', {
                fullName,
                phone,
                city,
                district,
                ward,
                detailAddress,
                typeAddress,
                isDefault,
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const updateAddress = async (
        addressId,
        fullName,
        phone,
        city,
        district,
        ward,
        detailAddress,
        typeAddress,
        isDefault,
    ) => {
        try {
            const response = await httpRequest.put(`/address/update/${addressId}`, {
                fullName,
                phone,
                city,
                district,
                ward,
                detailAddress,
                typeAddress,
                isDefault,
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const deleteAddress = async (id) => {
        try {
            const response = await httpRequest.delete(`/address/delete/${id}`);
            return response;
        } catch (error) {
            return error;
        }
    };

    return (
        <AddressContext.Provider
            value={{ addresses, setAddresses, getAddresses, createAddress, updateAddress, deleteAddress }}
        >
            {children}
        </AddressContext.Provider>
    );
}

export function useAddress() {
    return useContext(AddressContext);
}
