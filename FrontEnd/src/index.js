import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-toastify/dist/ReactToastify.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-quill/dist/quill.snow.css'

import GlobalStyles from '~/components/GlobalStyles'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { AddressProvider } from './contexts/AddressContext'
import { ChatProvider } from './contexts/ChatContext'
import { WishlistProvider } from './contexts/WishlistContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <AddressProvider>
                            <ChatProvider>
                                <App />
                            </ChatProvider>
                        </AddressProvider>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </GlobalStyles>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
