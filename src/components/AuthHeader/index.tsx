import React from 'react'
import styles from './styles.module.scss'
import { ReactComponent as Logo } from '../../assets/logo.svg';
import clsx from 'clsx';


const AuthHeader = ({className} : {className?: string}) => {
  return (
    <div className={clsx(styles['header'], className)}>
    <Logo />
    <span>
      Scribbbler
      <sup>
        <small>R</small>
      </sup>
    </span>
  </div>
  )
}

export default AuthHeader