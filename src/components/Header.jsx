//  Импортируем библиотеки  //
import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';

//  Импортируем логотип для вставки в src  //
import logo from '../images/logo-white.svg';

//  Принимаем email и signOut, рендерим компонент JSX компонента шапки  //

const Header = ({ email, signOut }) => {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип проекта Место" />
      <div className="header__wrapper-text">
        <Switch>
          <Route exact path="/">
            <p className="header__email">{email}</p>
            <NavLink to="/sign-in" className="header__button" onClick={signOut}>
              Выйти
            </NavLink>
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
