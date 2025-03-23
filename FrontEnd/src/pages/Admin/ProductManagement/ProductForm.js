import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';

import httpRequest from '~/utils/httpRequest';
import styles from './ProductManagement.module.scss';

const cx = classnames.bind(styles);

const ProductForm = ({ show, handleClose, handleSave, initialData }) => {
    const defaultProduct = {
        name: '',
        brand: '',
        image: '',
        priceOriginal: '',
        priceFinal: '',
        stock: '',
        rooms: [],
        category: '',
        description: '',
        sold: 0,
        variant: [],
    };

    const [product, setProduct] = useState(defaultProduct);
    const [categories, setCategories] = useState([]);
    const [imageLinks, setImageLinks] = useState({});

    // Cập nhật product khi initialData thay đổi
    useEffect(() => {
        if (initialData) {
            setProduct(JSON.parse(JSON.stringify(initialData))); // Clone object để tránh tham chiếu trực tiếp
        } else {
            setProduct(defaultProduct);
        }
        // eslint-disable-next-line
    }, [initialData]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await httpRequest.get('/categories');
                setCategories(res.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setProduct((prev) => ({
                ...prev,
                rooms: checked ? [...prev.rooms, value] : prev.rooms.filter((room) => room !== value),
            }));
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const handleImageLinkChange = (index, value) => {
        setImageLinks((prev) => ({
            ...prev,
            [index]: value, // Lưu URL riêng cho từng index biến thể
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...product.variant];
        updatedVariants[index][field] = value;
        setProduct({ ...product, variant: updatedVariants });
    };

    const addVariant = () => {
        setProduct({
            ...product,
            variant: [...product.variant, { name: '', images: [], stock: '' }],
        });
    };

    const removeVariant = (index) => {
        const updatedVariants = product.variant.filter((_, i) => i !== index);
        setProduct({ ...product, variant: updatedVariants });
    };

    const addImageToVariant = (index, imageUrl) => {
        if (imageUrl) {
            const updatedVariants = [...product.variant];
            updatedVariants[index].images.push(imageUrl);
            setProduct({ ...product, variant: updatedVariants });
        }
        setImageLinks((prev) => ({
            ...prev,
            [index]: '',
        }));
    };

    const removeImage = (variantIndex, imageIndex) => {
        const updatedVariants = [...product.variant];
        updatedVariants[variantIndex].images.splice(imageIndex, 1);
        setProduct({ ...product, variant: updatedVariants });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let updatedProduct = { ...product };

        if (
            !updatedProduct.image &&
            updatedProduct.variant.length > 0 &&
            updatedProduct.variant[0].images?.length > 0
        ) {
            updatedProduct.image = updatedProduct.variant[0].images[0];
        }

        handleSave(updatedProduct);
    };

    const handleCloseModal = () => {
        if (initialData) {
            setProduct(JSON.parse(JSON.stringify(initialData))); // Reset về dữ liệu ban đầu
        } else {
            setProduct(defaultProduct);
        }
        handleClose();
    };

    // console.log(product);

    return (
        <Modal show={show} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            className={cx('form-input')}
                        />
                    </Form.Group>

                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Thương hiệu</Form.Label>
                        <Form.Control
                            type="text"
                            name="brand"
                            value={product.brand}
                            onChange={handleChange}
                            required
                            className={cx('form-input')}
                        />
                    </Form.Group>

                    <Form.Group className={cx('form-group', 'position-relative')}>
                        <Form.Label className={cx('form-label')}>Giá gốc</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceOriginal"
                            value={product.priceOriginal}
                            onChange={handleChange}
                            required
                            className={cx('form-input')}
                        />
                        <span className={cx('position-absolute', 'bottom-0', 'span-price')}>.000đ</span>
                    </Form.Group>

                    <Form.Group className={cx('form-group', 'position-relative')}>
                        <Form.Label className={cx('form-label')}>Giá giảm giá</Form.Label>
                        <Form.Control
                            type="text"
                            name="priceFinal"
                            value={product.priceFinal}
                            onChange={handleChange}
                            required
                            className={cx('form-input')}
                        />
                        <span className={cx('position-absolute', 'bottom-0', 'span-price')}>.000đ</span>
                    </Form.Group>

                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Hàng tồn kho</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            required
                            className={cx('form-input')}
                        />
                    </Form.Group>

                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Đã bán</Form.Label>
                        <Form.Control
                            type="number"
                            name="sold"
                            value={product.sold}
                            onChange={handleChange}
                            required
                            className={cx('form-input')}
                        />
                    </Form.Group>

                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Danh mục</Form.Label>
                        <Form.Control
                            as="select"
                            name="category"
                            value={product.category || ''}
                            onChange={handleChange}
                            className={cx('form-input')}
                            required
                        >
                            <option value="">Chọn 1 danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Phòng</Form.Label>
                        <div className={cx('form-rooms')}>
                            {['Phòng khách', 'Phòng ngủ', 'Phòng làm việc', 'Phòng tắm', 'Phòng bếp'].map(
                                (room, index) => (
                                    <label
                                        className={cx('form-default-address', 'd-flex', 'align-items-center')}
                                        key={index}
                                    >
                                        <Form.Check
                                            key={room}
                                            type="checkbox"
                                            checked={product.rooms.includes(room)}
                                            value={room}
                                            onChange={handleChange}
                                            className={cx('custom-checkbox')}
                                        />
                                        <span className={cx('label-text')}>{room}</span>
                                    </label>
                                ),
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group className={cx('form-group')}>
                        <Form.Label className={cx('form-label')}>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            rows={10}
                            className={cx('form-input')}
                        />
                    </Form.Group>

                    <h5 className={cx('form-label')}>Biến thể</h5>
                    {product.variant.map((variant, index) => (
                        <div key={index} className="mb-3 border p-3 rounded">
                            <Row>
                                <Col md={4}>
                                    <Form.Group className={cx('form-group')}>
                                        <Form.Label className={cx('form-label')}>Tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                            required
                                            className={cx('form-input')}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className={cx('form-group')}>
                                        <Form.Label className={cx('form-label')}>Hàng tồn kho</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                            // required
                                            className={cx('form-input')}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className={cx('form-group')}>
                                        <Form.Label className={cx('form-label')}>Hình ảnh</Form.Label>
                                        <div className="d-flex">
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập URL của hình ảnh"
                                                className={cx('form-input')}
                                                value={imageLinks[index]}
                                                onChange={(e) => handleImageLinkChange(index, e.target.value)}
                                            />
                                            <Button
                                                variant="success"
                                                onClick={() => addImageToVariant(index, imageLinks[index])}
                                                className={cx('form-btn', 'ms-3')}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <div>
                                            {variant.images.map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="position-relative me-2 mt-3 d-flex align-items-center justify-content-between"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt="Variant Image"
                                                        thumbnail
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        // className="position-absolute top-0 end-0"
                                                        onClick={() => removeImage(index, i)}
                                                        className={cx('form-btn')}
                                                    >
                                                        x
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>
                                <div className="d-flex align-items-end mt-3">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeVariant(index)}
                                        className={cx('form-btn')}
                                    >
                                        Xóa biến thể
                                    </Button>
                                </div>
                            </Row>
                        </div>
                    ))}
                    <Button
                        variant="success"
                        onClick={addVariant}
                        className={cx('form-btn', 'mb-3', 'add-variant-btn')}
                    >
                        + Thêm biến thể mới
                    </Button>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            className={cx('form-btn', 'modal-action-btn')}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" className={cx('form-btn', 'modal-action-btn')}>
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProductForm;
