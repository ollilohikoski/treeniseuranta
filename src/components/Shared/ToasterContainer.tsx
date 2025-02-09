import { Toaster } from 'react-hot-toast';

const ToasterContainer: React.FC = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 5000,
                style:
                {
                    color: 'white',
                    backgroundColor: 'rgb(51 65 85)',
                }
            }} />

    );
};

export default ToasterContainer;