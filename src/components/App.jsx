//  Импортируем библиотеки, компоненты и утилиты  //
import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
//  import { Redirect } from 'react-router-dom';  //

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
//  import PopupWithForm from './PopupWithForm';  //
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';

import Login from './Login';
import Register from './Register';
// import Spinner from './Spinner';  //
import InfoTooltip from './InfoTooltip';

import ProtectedRoute from './ProtectedRoute';

//  Импортируем API для доступа к серверу  //
import {api} from '../utils/api';
import * as auth from '../utils/auth.js';

//  Импортируем контекст текущего пользователя  //
import CurrentUserContext from '../contexts/CurrentUserContext';

//  Импортируем стили  //
import '../index.css';

//  Вызываем хуки для открытия и закрытия попапов  //
function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  
  //  создаем стейт текущего пользователя и эффект при монтировании api.getUserInfo  //
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoadingData, setIsLoadingData] = useState(false);  //
  const [loggedIn, setLoggedIn] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  //  Чтобы изменять локальный список карточек из попапа, нужно поднять стейт  //
  //  создаем стейт для работы с карточками  //
  //  переносим переменную и функцию  //
  const [selectedCard, setSelectedCard] = useState({});
  const [cardToDelete, setCardToDelete] = useState({});
  const [cards, setCards] = useState([]);

  //  Функцию для роутинга пользователя после логина и выхода  //
  const history = useHistory();

  //  Объект routes для хранения адресов роутов  //
  /*  
  const routes = {
    homeRoute: '/',
    signIn: '/sign-in',
    signUp: '/sign-up',
  };
  */ 

  //  Создаем переменную для проверки на наличие открытого попапа  //
  const isOpen = isEditProfilePopupOpen || isEditAvatarPopupOpen || isAddPlacePopupOpen || isImagePopupOpen;


  //  Хук для направления на главную после успешного логина  //
  /* 
  useEffect(() => {
    if (!loggedIn) return;
    history.push('/');
    console.log(currentUser, email, loggedIn);

  }, [loggedIn, history])
  */

  //  Хук с функцией проверки токена и логином пользователя в случае успеха  //
  useEffect(() => {
    const tokenCheck = () => {
      if (!localStorage.getItem("jwt")) return;
      const jwt = localStorage.getItem("jwt");
      return auth
        .getContent(jwt)
        .then((data) => {
          if (data) {
            setEmail(data.email);
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((e) => {
          console.log(`Ошибка проверки токена: ${e}`);
        });
    }  
    tokenCheck();
  }, [history]);

  //  Обрабатываем авторизацию - сохраняем токен, сообщение, закрываем попап, шлем на главную  //
  //  Поправить текст на 'Вы успешно авторизовались' и 'Что-то пошло не так! Попробуйте ещё раз.'  //
  const handleLogin = (email, password) => {
    setIsLoading(true);
    auth.authorize(email, password)
      .then((data) => {
        if (!data.token) return;
        localStorage.setItem('jwt', data.token);
        setEmail(email);
        setLoggedIn(true);
        setMessage('Успешная авторизация');
//         console.log(currentUser, email, password, loggedIn);  //
        setIsPopupOpen(true);
        setTimeout(closeAllPopups, 3000);
        history.push('/');
      })
      .catch(e => {
        setLoggedIn(false);
        setMessage('Что-то не так! Ещё раз.');
        setIsPopupOpen(true);
        setTimeout(closeAllPopups, 3000);
        console.log(`Ошибка авторизации: ${e}`);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }
  //  Обрабатываем регистрацию - сохраняем логин на сервере, закрываем попап, шлем на логин  //
  //  Поправить текст на 'Вы успешно зарегистрировались' и 'Что-то пошло не так! Попробуйте ещё раз.'  //
  const handleRegister = (email, password) => {
    setIsLoading(true);
    auth.register(email, password)
      .then((res) => {
        setLoggedIn(true);
        setMessage('Успешная регистрация!');
        setIsPopupOpen(true);
        setTimeout(closeAllPopups, 3000);
        history.push('/sign-in');
      })
      .catch(e => {
        setLoggedIn(false);
        setMessage('Что-то не так! Ещё раз.');
        setIsPopupOpen(true);
        setTimeout(closeAllPopups, 3000);
        console.log(`Ошибка регистрации: ${e}`);
      })
      .finally(() => {
          setIsLoading(false);
      })
  }
  
  //  Создаем функцию логаута (удаляем токен из лок хранилища)  //
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail('');
    history.push('/sign-in');
  }

  //  Хук для получения профиля и карточек залогиненного юзера  //
  useEffect(() => {
    loggedIn && 
      Promise.all([
        api.getProfile(), 
        api.getCards()
      ])
        .then(([currentUser, cards]) => {
          setCurrentUser(currentUser);
          setCards(cards);
          history.push('/');
        })
        .catch(e => console.log(`Ошибка первой загрузки: ${e}`))
  }, [loggedIn]);

  useEffect(() => {
    function closeByEscape(event) {
      if(event.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]);


  const handleAvatarUpdate = async (obj) => {
    setIsLoading(true);
    try {
        const avatarChanged = await api.setAvatar(obj);
        setCurrentUser(avatarChanged);
        closeAllPopups();
    } catch (e) {
      console.log(`Ошибка обновления аватара: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }

  //  Добавляем обработчик в соотв-вии с пропсом onUpdateUser компонента EditProfilePopup  //
  // Внутри этого обработчика вызовите api.setUserInfo  //
  // После завершения запроса обновите стейт currentUser из полученных данных и закройте все попапы  //
  
//  const handleUpdateUser = async (obj) => {
//  console.log(`handleUpdateUser obj: ${obj.name}, ${obj.about}, loggedIn: ${loggedIn}`);  //
/*
    setIsLoading(true);
    try {
      const changedProfile = await api.setProfile(obj);
      setCurrentUser(changedProfile);
      closeAllPopups();
    } catch (e) {
      console.log(`Ошибка обновления профиля: ${e}`);
    } finally {
      setIsLoading(false);      
    }
  }
*/


const handleUpdateUser = (obj) => {
  console.log(`handleUpdateUser obj: ${obj.name}, ${obj.about}, loggedIn: ${loggedIn}`);
  setIsLoading(true);
    api.setProfile(obj)
      .then((res) => {
        setCurrentUser(res);
      })
      .then(() => closeAllPopups())
      .catch((e) => console.log(`Ошибка обновления профиля: ${e}`))

      .finally(() => {
        setIsLoading(false);
      });
  }


  const handleAddPlace = async (obj) => {
    setIsLoading(true);
    try {
        const newPlace = await api.addCard(obj);
        setCards([newPlace, ...cards]);
        closeAllPopups();
    } catch(e) {
      console.log(`Ошибка добавления новой карточки: ${e}`);
    } finally {
        setIsLoading(false);
    }
  }

  //  переносим обработчики handleCardLike и handleCardDelete. В Main передаем в виде пропсов  //
  //  проверяем, есть ли уже лайк на этой карточке (isLiked)  //
    
  //  получаем через api данные пользователя и карточек //

  const handleCardLike = async (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    try {
        const resChangeLikeStatus = await api.changeLikeCardStatus(card, !isLiked);
        setCards((state) => state.map((c) => c._id === card._id ? resChangeLikeStatus : c));
    } catch (e) {
      console.log(`Ошибка обработки лайка: ${e}`);
    }
  }

  //  Функция для обработки лайка до рефакторинга  //
  /*    
    const handleCardLike = (card) => {
      const isLiked = card.likes.some((i) => i._id === currentUser._id);
      if (isLiked) {
        api
          .deleteLike(card._id)
          .then((newCard) => {
            setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
          })
          .catch((e) => {
            console.log(`Ошибка удаления лайка: ${e}`);
          });
      } else {
        api
          .addLike(card._id)
          .then((newCard) => {
            setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
          })
          .catch((e) => {
            console.log(`Ошибка добавления лайка: ${e}`);
          });
      }
    }
  */

  const handleCardDelete = async (card) => {
    setIsLoading(true);
    try {
        await api.deleteCard(card);
        setCards((newArray) => newArray.filter((item) => card._id !== item._id))
        closeAllPopups();
    } catch (e) {
      console.log(`Ошибка удаления карточки: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }

  //  хук для ассинхронного получения профиля  //
  /* 
  const fetchProfile = async () => {
    try {
        const profileObject = await api.getProfile();
        setCurrentUser(profileObject);
    } catch (e) {
      console.log(`Ошибка получения данных профиля: ${e}`);
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])
  */

  //  хук для ассинхронного получения карточек  //
  /* 
  const fetchCards = async () => {
    try {
      const res = await api.getCards();
      setCards(res);
    } catch (e) {
      console.log(`Ошибка получения карточек: ${e}`);
    }
  }

  useEffect(() => {
    fetchCards();
  }, [])
  */


  //  Создаем императивные обработчики для кнопок открытия попапов  //
  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  const handleCardDeleteClick = (card) => {
    setCardToDelete(card);
    setIsConfirmationPopupOpen(true);
  };


  //  Закрываем все попапы  //
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsPopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setSelectedCard({});
  };

  //  Возвращаем JSX-код страницы  //
  //  Вставляем компоненты Header, Main, Footer и компоненты попапов  //
  //  Внутри Main добавляем императивные обработчики  //
  //  Оборачиваем JSX в провайдер контекста с currentUser  //
  //  Выносим JSX попапов в отдельные компоненты  //
  
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header 
          email={email}
          loggedIn={loggedIn}
          onLogout={handleLogout} 
        />
        <Switch>
        <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              closePopup={closeAllPopups}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDeleteClick}
              cards={cards}
            />
          </ProtectedRoute>
          <Route path="/sign-in">
            <Login title="Вход" buttonText="Войти" onLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register title="Регистрация" buttonText="Зарегистрироваться" 
            onRegister={handleRegister}
            />
          </Route>
        </Switch>
        <Footer />
        <InfoTooltip
          popupText={message}
          isOpen={isPopupOpen}
          onClose={closeAllPopups}
          loggedIn={loggedIn}
        />        
        <EditProfilePopup 
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen} 
          onClose={closeAllPopups} 
          onAddPlace={handleAddPlace}
          isLoading={isLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleAvatarUpdate}
          isLoading={isLoading}
        />
        <ImagePopup 
          card={selectedCard} 
          onClose={closeAllPopups} 
          isOpen={isImagePopupOpen} 
        />
        <ConfirmationPopup 
          cardToDelete={cardToDelete} 
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          isOpen={isConfirmationPopupOpen} 
          isLoading={isLoading}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;