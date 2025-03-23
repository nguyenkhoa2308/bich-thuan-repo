import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Spinner, Form, InputGroup } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './ProductManagement.module.scss';
import ProductForm from './ProductForm';
import httpRequest from '~/utils/httpRequest';
import ConfirmDialog from '~/components/Dialog/ConfirmDialog';
import CustomPagination from '~/components/CustomPagination';

const cx = classnames.bind(styles);

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const removeAccents = (str) => {
        return str
            .normalize('NFD') // Chuyển về dạng Unicode tổ hợp
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
            .toLowerCase(); // Chuyển về chữ thường
    };

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const [delProductId, setDelProductId] = useState(null);

    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(products.filter((product) => removeAccents(product.name).includes(removeAccents(search))));
        setCurrentPage(1);
    }, [search, products]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await httpRequest.get('/products');

            setProducts(res);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    const handleAdd = () => {
        setCurrentProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        setIsConfirmDialogOpen(true);
        setDelProductId(id);
        // await httpRequest.delete(`/products/${id}`);
    };

    const handleConfirm = async () => {
        await httpRequest.delete(`/products/${delProductId}`);
        setIsConfirmDialogOpen(false);
        fetchProducts();
    };

    const handleSave = async (product) => {
        try {
            if (product._id) {
                // Xóa slug trước khi gửi request để Mongoose cập nhật lại dựa trên name
                const { slug, ...updatedProduct } = product;
    
                await httpRequest.put(`/products/${product._id}`, updatedProduct);
                setCurrentProduct(null);
            } else {
                await httpRequest.post('/products/add', product);
            }
            fetchProducts();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };
    

    // Tính toán dữ liệu hiển thị theo trang
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Chuyển trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        // Cuộn trang về vị trí danh sách sản phẩm (hoặc vị trí mong muốn)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Container>
            <h2 className="my-4">Quản lý sản phẩm</h2>
            <Button variant="primary" onClick={handleAdd} className={cx('add-btn')}>
                Thêm sản phẩm mới
            </Button>

            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="fs-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-primary" className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faSearch} className="fs-5" />
                </Button>
            </InputGroup>

            {loading ? (
                <Spinner animation="border" className="mt-3" />
            ) : (
                <div className={cx('product-wrapper')}>
                    {currentProducts.map((product, index) => {
                        return (
                            <div className={cx('product-container')} key={index}>
                                <div className={cx('product-card')}>
                                    <div className={cx('product-image-container')}>
                                        <Link to={`/products/${product.slug}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={cx('product-image')}
                                            />
                                        </Link>
                                    </div>
                                    <div className={cx('product-detail')}>
                                        <Link to={`/products/${product.slug}`}>
                                            <h3 className={cx('product-name')}>{product.name}</h3>
                                        </Link>
                                        <div className={cx('product-price')}>
                                            <span
                                                className={cx('price-final', {
                                                    sale: product.priceFinal !== product.priceOriginal,
                                                })}
                                            >
                                                {new Intl.NumberFormat('en-US').format(product.priceFinal * 1000)}₫
                                            </span>
                                            {product.priceFinal !== product.priceOriginal && (
                                                <span className={cx('price-original')}>
                                                    {new Intl.NumberFormat('en-US').format(
                                                        product.priceOriginal * 1000,
                                                    )}
                                                    ₫
                                                </span>
                                            )}
                                        </div>
                                        <div className={cx('product-action')}>
                                            <div className={cx('action-btn')}>
                                                <Button
                                                    className={cx('edit-btn')}
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Chỉnh sửa
                                                </Button>
                                                <Button
                                                    className={cx('delete-btn')}
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ProductForm
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleSave}
                initialData={currentProduct}
            />

            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={() => {
                    handleConfirm();
                }}
                title="Bạn chắc chắn muốn xóa sản phẩm này?"
            />

            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
        </Container>
    );
};

export default ProductManagement;
