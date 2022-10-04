//  Импортируем библиотеки  //
import React, { useState } from 'react';
//  import { useState, useEffect } from 'react';  //
import { Switch, Route, Link } from 'react-router-dom';

//  Импортируем логотип и бургер-меню для вставки в src  //
import logo from '../images/logo-white.svg';
import burger from '../images/header-menu.svg';
import close from '../images/button-close.svg';



//  Принимаем email и signOut, рендерим компонент JSX компонента шапки  //
//  Меню будет отличаться в зависимости от состояния loggedIn, для мобильной версии - бургер  //
const Header = ({ loggedIn, email, onLogout }) => {
  const [menuOpened, setMenuOpened] = useState(false);

  //  console.log(`loggedIn / headerEmail: ${loggedIn} / ${headerEmail}`);  //

  //  Переключатель состояния меню  
  const toggleMenu = () => {
    setMenuOpened((state) => !state);
  };

  const handleLogout = () => {
    setMenuOpened(false);
    onLogout();
  };

//  console.log(loggedIn, email);  //
  
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип проекта Mesto" />

      <div className="header__wrapper-text">
        <Switch>
          <Route path="/sign-in">
            <Link className="header__button" to="sign-up" >
              Регистрация
            </Link>
          </Route>
          <Route path="/sign-up">
            <Link className="header__button" to="/sign-in">
              Войти
            </Link>
          </Route>
          <Route path="/">
            {loggedIn && (
              <>
                <button
                  className="header__menu-button"
                  type="button"
                  style={{ backgroundImage: `url(${menuOpened ? close : burger})` }}
                  onClick={toggleMenu}
                />
                <div className={`header__menu-auth ${!menuOpened && 'header__menu-auth_hidden'}`}>
                  {email && <span className="header__auth-profile">{email}</span>}
                  <Link className="header__button" to="/sign-in" onClick={handleLogout} >
                    Выйти
                  </Link>
                </div>
              </>
            )}
          </Route>
        </Switch>
      </div>
    </header>
  );
}

/*
         <Route path="/">
            {loggedIn && (
              <button
                className="header__burger-button"
                type="button"
                style={{ backgroundImage: `url(${menuOpened ? close : burger})` }}
                onClick={toggleMenu}
              />
            )}
          </Route>
*/

export default Header;
