import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from 'config/firebase'
import { XCircleIcon } from '@heroicons/react/solid'
import { useState } from "react"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Signin() {
  const [ error, setError ] = useState(false)
  const navigate = useNavigate()

  const handleSignin = ({ email, password }) => {
    console.log(email, password)
    signInWithEmailAndPassword(auth, email, password)
      .then(async ({user}) => {
        // Signed in 
        console.log('res', user)
        const userData = await getDoc(doc(db, "users", user.uid))
        if(userData.exists()) {
          console.log("exist:", userData.data())
        }else{
          const newUserData = {
            email: user.email,
            name: user.displayName ? user.displayName : 'Default User',
            role: 'user',
            avatar: null,
          }
          await handleMakeUser(user.uid, newUserData)
        }
        navigate('/')
        // ...
      })
      .catch((err) => {
        console.error('err', err)
        setError(true)
      });
  }

  const handleMakeUser = async (uid, data) => {
    await setDoc(doc(db, "users", uid), data)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-24 w-auto"
          src="/logo-min.png"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>

        {error &&
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">You have entered an invalid username or password</h3>
              </div>
            </div>
          </div>
        }

      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action="#" method="POST" onSubmit={(e) => {
            e.preventDefault()
            handleSignin({ email: e.target.email.value, password: e.target.password.value })
          }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <a href="#">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
