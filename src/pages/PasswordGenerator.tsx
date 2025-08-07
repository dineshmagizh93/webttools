import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Slider,
  Chip,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Lock as LockIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
  description: string;
}

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const generatePassword = () => {
    const {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
      excludeAmbiguous,
    } = options;

    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Exclude similar characters
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    // Exclude ambiguous characters
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()/\\'"`~,;:.<>]/g, '');
    }

    if (charset === '') {
      setPassword('');
      return;
    }

    let generatedPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generatedPassword += charset[array[i] % charset.length];
    }

    setPassword(generatedPassword);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const calculateStrength = (): PasswordStrength => {
    if (!password) {
      return {
        score: 0,
        label: 'No Password',
        color: 'error',
        description: 'Generate a password to see strength',
      };
    }

    let score = 0;

    // Length contribution
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;

    // Character variety contribution
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Bonus for mixed case
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;

    // Bonus for numbers and symbols
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 1; // Common sequences

    score = Math.max(0, Math.min(10, score));

    if (score <= 2) {
      return {
        score,
        label: 'Very Weak',
        color: 'error',
        description: 'Too short or too simple',
      };
    } else if (score <= 4) {
      return {
        score,
        label: 'Weak',
        color: 'error',
        description: 'Should be longer and more complex',
      };
    } else if (score <= 6) {
      return {
        score,
        label: 'Fair',
        color: 'warning',
        description: 'Acceptable but could be stronger',
      };
    } else if (score <= 8) {
      return {
        score,
        label: 'Good',
        color: 'info',
        description: 'Strong password',
      };
    } else {
      return {
        score,
        label: 'Excellent',
        color: 'success',
        description: 'Very strong password',
      };
    }
  };

  const strength = calculateStrength();

  useEffect(() => {
    generatePassword();
  }, [options]);

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Password Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate strong, secure passwords with customizable options. 
          Perfect for creating unique passwords for all your accounts.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon color="primary" />
                Generated Password
              </Typography>

              <Box sx={{ position: 'relative', mb: 2 }}>
                <TextField
                  fullWidth
                  value={password}
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </Button>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CopyIcon />}
                  onClick={copyToClipboard}
                  disabled={!password}
                  fullWidth
                >
                  Copy Password
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={generatePassword}
                >
                  Generate New
                </Button>
              </Box>

              <Paper sx={{ p: 2, backgroundColor: 'rgba(144, 202, 249, 0.1)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Password Strength
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={strength.score * 10}
                    color={strength.color}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Chip
                    label={strength.label}
                    color={strength.color}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {strength.description}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                Password Options
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Length: {options.length} characters
                </Typography>
                <Slider
                  value={options.length}
                  onChange={(_, value) => setOptions(prev => ({ ...prev, length: value as number }))}
                  min={4}
                  max={64}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.includeUppercase}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
                    />
                  }
                  label="Include Uppercase Letters (A-Z)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.includeLowercase}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
                    />
                  }
                  label="Include Lowercase Letters (a-z)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.includeNumbers}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                    />
                  }
                  label="Include Numbers (0-9)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.includeSymbols}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                    />
                  }
                  label="Include Symbols (!@#$%^&*)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.excludeSimilar}
                      onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                    />
                  }
                  label="Exclude Similar Characters (i, l, 1, L, o, 0, O)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.excludeAmbiguous}
                      onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
                    />
                  }
                  label="Exclude Ambiguous Characters ({}, [], (), /, etc.)"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Password Security Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                ✅ Do's
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                <li>Use at least 12 characters</li>
                <li>Include uppercase, lowercase, numbers, and symbols</li>
                <li>Use unique passwords for each account</li>
                <li>Consider using a password manager</li>
                <li>Change passwords regularly</li>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                ❌ Don'ts
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                <li>Don't use personal information</li>
                <li>Don't use common words or phrases</li>
                <li>Don't reuse passwords across accounts</li>
                <li>Don't share passwords with others</li>
                <li>Don't store passwords in plain text</li>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            How it works
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Our password generator creates cryptographically secure passwords using:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Cryptographically secure random number generation</li>
            <li>Customizable character sets and length</li>
            <li>Real-time strength analysis</li>
            <li>Option to exclude similar or ambiguous characters</li>
            <li>No data sent to external servers</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            All password generation happens locally in your browser for maximum security.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PasswordGenerator;
