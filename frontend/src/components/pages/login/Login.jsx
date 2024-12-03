import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { loading, login, loginWithSocial } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Login
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='Enter username'
							className='w-full input input-bordered h-10'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to='/signup' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Login"}
						</button>
					</div>
				</form>

				{/* Соціальні кнопки */}
				<div className='flex justify-center mt-4'>
					<button
						className='flex items-center bg-red-500 text-white px-4 py-2 rounded-lg mr-2'
						onClick={() => loginWithSocial("google")}
					>
						<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5 mr-2" />
						Google
					</button>
					<button onClick={() => {
   						 window.location.href ="http://localhost:5000/auth/facebook"; }}
  					className='flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg mr-2'>
  					<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/800px-Facebook_logo_%28square%29.png" alt="Facebook" className="w-5 h-5 mr-2" /> Facebook </button>
					<button
						className='flex items-center bg-black text-white px-4 py-2 rounded-lg'
						onClick={() => loginWithSocial("github")}
					>
						<img src="https://img.icons8.com/?size=512&id=52539&format=png" alt="GitHub" className="w-5 h-5 mr-2" />
						Github
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
