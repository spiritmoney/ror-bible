import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthTitle from '../AuthTitle';
import Input from '../Input';
import Button from '../Button';
import { LoginRoute } from '../../navigation/routes';
import { IRegisterInputs } from '../../interface/auth';
import { useFormik } from 'formik';
import axios from 'axios';
import { sortArrayObjectsBaseOnString } from '../../utils/format';
import { useEffectOnce } from 'usehooks-ts';
import { useFirebase } from '../../hooks/useFirebase';
import bcrypt from 'bcryptjs';
import { registerSchema } from 'config/authSchema';
import { IUser } from 'interface/user';
import { DateTime } from 'luxon';
// import style from './styles.module.scss';

export interface IRegister { }

const Register: React.FunctionComponent<IRegister> = () => {
  const [countriesData, setCountriesData] = useState<any>([]);
  const [loading, setLoading] = useState(false)
  const { getOnce, add } = useFirebase();
  const navigate = useNavigate();

  const onSubmit = async (value: IRegisterInputs) => {
    setLoading(true)
    const { email, fullName, password, region, terms } = value;

    if (!terms) {
      setLoading(false)
      return
    }
    const newUser: IUser = {
      fullName,
      email,
      password: bcrypt.hashSync(password),
      region,
      terms,
      isActive: false,
      createdAt: DateTime.now().toISO(),
      role: 'editor',
    };


    try {
      const exists = await getOnce({ col: 'users', id: email });

      if (!exists) {
        await add({
          col: 'users',
          data: newUser,
          id: value.email,
        });
        navigate(LoginRoute);
      } else {
        setLoading(false)
        errors.email = 'Email already exists'
      }
    } catch (error) {
      setLoading(false)
      console.error({ error })
    }

  };

  const { values, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      region: 'Nigeria',
      terms: false,
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  const getCountries = async () => {
    try {
      const res = await axios.get('https://restcountries.com/v3.1/all');
      setCountriesData(res.data);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  useEffectOnce(() => {
    getCountries();
  });

  return (
    <div className="flex items-center justify-center flex-col my-auto">
      <div className="max-w-[30rem] w-full ">
        <AuthTitle
          title="Hi ,Welcome to Scribbbler!"
          subtitle={'Edit, Review & Publish in one workspace'}
        />
        <form
          noValidate
          action="#"
          className="mt-[45px] mb-[0.8rem] flex flex-col gap-y-[0.8rem]"
          onSubmit={handleSubmit}
        >
          <Input
            type={'text'}
            label="Full Name"
            name="fullName"
            required
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fullName}
          />
          <Input
            type={'email'}
            label="Email"
            name="email"
            placeholder="mail@scribbbler.com"
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />
          <Input
            type={'password'}
            label="Password"
            name="password"
            required
            value={values.password}
            placeholder="Min. 8 characters"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />
          <Input
            type={'password'}
            label="Confirm Password"
            name="confirmPassword"
            required
            value={values.confirmPassword}
            placeholder="Min. 8 characters"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
          />

          <Input
            type={'select'}
            label="Region/Country"
            name="region"
            required
            selectData={sortArrayObjectsBaseOnString(
              countriesData.map((country: any) => ({
                name: `${country.name.common}`,
                value: country.name.common,
              }))
            )}
            value={values.region}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.region}
          />
          <Input
            type={'checkbox'}
            checkboxValue={values.terms}
            label={
              <>
                I agree to the{' '}
                <Link to="" className="text-primary">
                  Terms & Conditions
                </Link>
              </>
            }
            name="terms"
            className="mb-[0rem] -mt-1 w-max mx-auto"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.terms}
          />
          <Button type="submit" loading={loading} disabled={loading} fullWidth primary>
            Get Started
          </Button>
        </form>

        <p className="block mx-auto w-fit text-faded-black text-[15px]">
          Already have an account ?{' '}
          <Link to={LoginRoute} className="underline text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
