//  Отдельный компонент для редактирования попапа  //
//  Импортируем компоненты, состояния и контекст  //

import React, {useContext, useEffect} from 'react';
import CurrentUserContext from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../hooks/useFormAndValidation";

const EditProfilePopup = ({isOpen, onClose, onUpdateUser, isLoading}) => {
    
    const {values, handleChange, errors, isValid, setValues} = useFormAndValidation({});
    //  Подписываемся на контекст  //
    const currentUser = useContext(CurrentUserContext);
    //  Cоздаем эффект для обновления стейта при изменении контекста  // 

    useEffect(() => {
        setValues(currentUser);
    }, [currentUser, isOpen]);

    function handleSubmit(event) {
        event.preventDefault();
        onUpdateUser(values.name, values.about);
    }

/*  Старая версия  
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    function handleSubmit(e) {
        e.preventDefault();    
        onUpdateUser({
            name,
            about: description,
        });
    }      

   
    //  Присваеваем текущие значения полей  //
    useEffect(() => {
        if (currentUser.name && currentUser.about) {
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [currentUser, isOpen])



    const onNameChange = (e) => {
        setName(e.target.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.target.value)
    }
*/
    return (
        <PopupWithForm
            name={'profile'}
            isOpen={isOpen}
            isValid={isValid}
            onClose={onClose}
            title={'Редактировать профиль'}
            buttonText={isLoading? 'Сохранение...' : 'Сохранить'}
            onSubmit={handleSubmit}
        >
            <fieldset className="popup__fieldset" id="fieldsetProfileEdit">
            <label className="fpopup__label">
                <input 
                    className={`popup__input popup__input_user_name ${errors.name ? 'popup__field-error_type' : ''}`}
                    type="text" 
                    name="profileName" 
                    id="profile-name" 
                    placeholder="Введите имя пользователя" 
                    required 
                    minLength="2" 
                    maxLength="40" 
                    value={values.name || ''} 
                    onChange={handleChange} 
                />
                <span 
                  className={`popup__field-error profile-name-error ${
                    errors.name ? 'popup__field-error_active' : ''
                  }`}
                >{errors.name}</span>
            </label>
            <label className="popup__label">
                <input 
                    className={`popup__input popup__input_user_job" ${errors.link ? 'popup__field-error_type' : ''}`} 
                    type="text"
                    name="profileJob" 
                    id="profile-job" 
                    placeholder="Профессия" 
                    required 
                    minLength="2" 
                    maxLength="200" 
                    value={values.about || ''} 
                    onChange={handleChange} 
                />
                <span 
                    className={`popup__field-error profile-job-error" ${
                        errors.about ? 'popup__field-error_active' : ''}`}
                >{errors.about}</span>
            </label>
            </fieldset>
        </PopupWithForm>
    );
};

export default EditProfilePopup;