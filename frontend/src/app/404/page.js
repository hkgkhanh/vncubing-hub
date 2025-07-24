// import logo from './logo_vnca.svg';
import '../../App.css';
import '../../styles/notfound/default.css'
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import notFoundData from '../../frontend_data/notfound.json';

function NotFound() {
    const notFoundText = notFoundData['not_found_text'];
    const backToHomeText = notFoundData['back_to_home_text'];

    return (
        <div className="not-found-layout">
            <Navbar />
            <div className="not-found">
                    <h1>404</h1>
                    <p>{notFoundText.vi}</p>
                    <a href="/" className="back-home">{backToHomeText.vi}</a>
            </div>
            <Footer />
        </div>
    );
}

export default NotFound;