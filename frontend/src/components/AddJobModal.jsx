import { useState } from "react";

export default function addJobModal({ isOpen, onClose, onAdd}){
    const [formData, setForm] = useState({
        company: '',
        position: '',
        status: 'Wishlist',
        salary: ''
    })
}