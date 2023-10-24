import React from 'react'

const Register = () => {
  return (
    <>
      <div>
        <h1>Register</h1>
        <div>
            <label htmlFor="name">
                Name: <input type="text" />
            </label>
            <label htmlFor="email">
                Email: <input type="text" />
            </label>
            <label htmlFor="mobile">
                Mobile: <input type="text" />
            </label>
            <label htmlFor="password">
                Password: <input type="text" />
            </label>
            <label htmlFor="confirm password">
                Confirm Password: <input type="text" />
            </label>
        </div>
      </div>
    </>
  )
}

export default Register
