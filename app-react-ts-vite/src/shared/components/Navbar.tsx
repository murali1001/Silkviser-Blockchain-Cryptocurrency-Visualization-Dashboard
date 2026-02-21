import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.scss';

function Navbar() {
  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: '#455372' }}>
        {' '}
        {/* Change the background color here */}
        <Toolbar variant="dense">
          <IconButton edge="start"></IconButton>
          <Link to={'/'}>
            <Typography variant="h6">
              <span style={{ color: 'white' }}>Silk</span>
              <span style={{ color: '#d0b693' }}>Viser</span>
            </Typography>
          </Link>
          <div className="align-right">
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/">
              Blocks
            </Button>
            {/* <Button color="inherit" component={Link} to='/'>Tokens</Button> */}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
