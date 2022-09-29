//  Компонент попапа для подтверждения удаления карточки  //

import React from 'react';
import PopupWithForm from './PopupWithForm';
/* import {useForm} from "../hooks/useForm"; */

//  Обработчик кнопки подтверждения вызывает функцию удаления и закрывает попап  //
//  Карточка cardToDelete помечается на удаление при клике (в App.jsx)  // 
function ConfirmationPopup({ isOpen, onClose, cardToDelete, onCardDelete, isLoading }) {
//   const {values, handleChange, setValues} = useForm({});  //
  function handleSubmit(event) {
    event.preventDefault();
    onCardDelete(cardToDelete);
    onClose();
  }

  return (
    <PopupWithForm 
      name="confirm" 
      title="Вы уверены?" 
      buttonText={isLoading ? 'Удаление...' : 'Да'}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
      onCardDelete={onCardDelete}
      isValid={true}
    />
  )
}

export default ConfirmationPopup;