'use client';

import Link from 'next/link';
import { AppBar, Avatar, Box, Button, Skeleton, Toolbar, Typography } from '@mui/material';
import { useAuth } from '@/lib/useAuth';

export default function NavBar() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none', letterSpacing: '-0.02em' }}
        >
          Prompt Roast
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {loading ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : user ? (
            <>
              <Button component={Link} href="/history" size="small" color="inherit">
                History
              </Button>
              <Avatar
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? 'User'}
                sx={{ width: 32, height: 32, fontSize: 14 }}
              >
                {user.displayName?.[0] ?? user.email?.[0] ?? 'U'}
              </Avatar>
              <Button size="small" color="inherit" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Button variant="outlined" size="small" onClick={signIn}>
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
