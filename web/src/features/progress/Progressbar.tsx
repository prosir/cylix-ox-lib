import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100vh',
    paddingBottom: '12vh',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1000,
  },
  nuiBody: {
    display: 'none',
    position: 'fixed',
    bottom: '6vh',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(18, 20, 28, 0.75)',
    padding: '1vh 2vw',
    borderRadius: '6px',
    width: 'fit-content',
  },
  progressBarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25vw',
    height: '2.5vh',
    position: 'relative',
  },
  progressBar: {
    width: '2vw',
    height: '1.8vh',
    position: 'relative',
    margin: '0 0.2vw',
  },
  leftHalf: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1b1b1b',
    clipPath: 'polygon(0 0, 80% 0, 0 100%)',
    transition: 'background-color 0.3s ease',
  },
  rightHalf: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1b1b1b',
    clipPath: 'polygon(100% 0, 100% 100%, 20% 100%)',
    transition: 'background-color 0.3s ease',
  },
  filledLeft: {
    backgroundColor: '#f41e42',
    filter: 'drop-shadow(0px 0px 3px #f41e42)',
  },
  filledRight: {
    backgroundColor: '#f41e42',
    filter: 'drop-shadow(0px 0px 3px #f41e42)',
  },
  percentageText: {
    position: 'absolute',
    bottom: '3.5vh',
    right: '-3vh',
    fontSize: '1.6vh',
    fontWeight: 'bold',
    color: theme.colors.gray[3],
  },
  centerText: {
    position: 'absolute',
    bottom: '4.5vh',
    left: '1vh',
    fontSize: '1.6vh',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
}));

const Progressbar: React.FC = () => {
  const { classes, cx } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0); // Reset progress when a new event is triggered

    const stepTime = data.duration / 20;
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setVisible(false);
        fetchNui('progressComplete');
      }
    }, stepTime);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Box className={classes.nuiBody}>
          <Box className={classes.progressBarContainer}>
            {Array.from({ length: 10 }, (_, index) => (
              <Box className={classes.progressBar} key={index}>
                <Box className={cx(classes.leftHalf, progress >= (index + 1) * 10 && classes.filledLeft)} />
                <Box className={cx(classes.rightHalf, progress >= (index + 1) * 20 && classes.filledRight)} />
              </Box>
            ))}
            <Text className={classes.percentageText}>{progress}%</Text>
          </Box>
          <Text className={classes.centerText}>{label}</Text>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default Progressbar;
