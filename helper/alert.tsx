import ReactDOM from "react-dom/client"
import Alert, { AlertProps, AlertColor } from "@mui/material/Alert"
import Snackbar from '@mui/material/Snackbar';

type Props = {
    msg: React.ReactNode;
} & AlertProps

let alertRoot: ReactDOM.Root

const render = (msg: string, type: AlertColor, props?: Props) => {
    if (!alertRoot) {
        const promptContainer = document.createElement('div')
        document.body.appendChild(promptContainer)
        alertRoot = ReactDOM.createRoot(promptContainer)
    }
    const close = () => {
        tootle(false)
    }
    const tootle = (open: boolean) => {
        alertRoot.render(<Snackbar open={open} onClose={close} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity={type}>
                {msg}
            </Alert>
        </Snackbar>)
    }
    tootle(true)
}

export const error = (msg: string, props?: Props) => {
    render(msg, 'error', props)
}