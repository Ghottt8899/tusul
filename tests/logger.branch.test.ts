import { logger } from '../src/utils/logger';

describe('logger branches', () => {
  const origDebug = process.env.DEBUG;
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const errSpy  = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errSpy.mockRestore();
    process.env.DEBUG = origDebug;
  });

  it('debug OFF үед console.log дуудагдахгүй', () => {
    delete process.env.DEBUG;
    logger.debug('nope');
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('debug ON үед console.log дуудагдана', () => {
    process.env.DEBUG = '1';
    logger.debug('hello');
    expect(logSpy).toHaveBeenCalled();
  });

  it('warn / error замуудыг хамарна', () => {
    logger.warn('something');
    logger.error('bad');
    expect(warnSpy).toHaveBeenCalled();
    expect(errSpy).toHaveBeenCalled();
  });
});