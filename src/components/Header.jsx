//  Импортируем библиотеки  //
import React from 'react';
//  import { useState, useEffect } from 'react';  //
import { Switch, Route, NavLink } from 'react-router-dom';

//  Импортируем логотип и бургер-меню для вставки в src  //
import logo from '../images/logo-white.svg';
//  import burger from '../images/header-menu.svg';  //

//  Принимаем email и signOut, рендерим компонент JSX компонента шапки  //
const Header = ({ loggedIn, email, onLogout }) => {
  return (
    <header className="header">
      <a href="#app" className="header__logo-link">
        <img className="header__logo" src={logo} alt="Логотип проекта Mesto" />
      </a>
      <div className="header__wrapper-text">
        <Switch>
          <Route path="/">
            <p className="header__email">{email}</p>
            <NavLink to="/sign-out" className="header__button" onClick={onLogout}>Выйти</NavLink>
          </Route>
          <Route path="/sign-up">
            <NavLink to="/sign-in" className="header__button">
              Войти
            </NavLink>
          </Route>
          <Route path="/sign-in">
            <NavLink to="sign-up" className="header__button">
              Регистрация
            </NavLink>
          </Route>
        </Switch>
      </div>
    </header>
  );
}

/*
const Header = () => {
  return (
    <header className="header">
      <a href="#">
        <img className="header__logo" src={logo} alt="Логотип проекта Место" />
      </a>
    </header>
  );
};
*/

export default Header;
