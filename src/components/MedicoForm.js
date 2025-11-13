import React, {useState, useEffect} from "react";
import {View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform, Picker} from 'react-native'

const especialidade = [' Selecionar..', 'Cardiologia', 'Pediatria', 'Dermatologia', 'Neurologia', "Oftalmologia", 'Clinica Geral'];
const initialMedicoState = {
    nome:'', especialidade:especialidade[0], crm:'', email:'',telefone:'', logradouro:'', numero:'', complemento:'', cidade:'', uf:'', cep:''
}
const MedicoForm = ({medico, onSave, onCancel, navigation})=>{
    const [formData, setFormData] = useState(medico || initialMedicoState)

    const [errors, setErrors] = useState({})

    const isEditing = !!medico
    const buttonTitle = isEditing ? 'Concluir Edição' : 'Concluir Cadastro'

    const requireFields = ['nome', 'especialidade', 'crm', 'telefone', 'logradouro', 'numero', 'uf', 'cep']

    useEffect(()=>{
        setFormatData(medico||initialMedicoState)
    },[medico])


    const handleChange=(name, value) =>{
        setFormData(prev => ({...prev,[name]:value}))
        if(errors[name]){
            setErrors(prev =>{
                const newErrors = {...prev}
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validade = () =>{
        let valid = true
        const newErrors ={
            
            requireFields,foreach(field =>{
                if(!formData[field] || String(FormData[field]).trim() === ''){
                    newErrors[field] = 'Campo Obrigatório';
                    valid = false
                }
            })
            setErrors(newErrors)
            return valid;
        };

        const handleSubmit = () => {
            onSave(formData)
            Alert.alert(
                isEditing ?'Sucesso': 'Cadastro concluido'
                isEditing ? 'Dados do medico atualizado.' : 'Novo medico cadastrado'
            )
        }
    }
}