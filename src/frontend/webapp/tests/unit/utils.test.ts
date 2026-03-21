import { inferFileType, formatDate, clamp, stringToColour } from '../../src/shared/utils';

describe('inferFileType', () => {
  it.each([
    ['contract.pdf',  'PDF'],
    ['annex.PDF',     'PDF'],
    ['report.docx',   'DOCX'],
    ['report.doc',    'DOCX'],
    ['data.xlsx',     'XLSX'],
    ['data.xls',      'XLSX'],
    ['scan.png',      'IMG'],
    ['scan.jpg',      'IMG'],
    ['scan.jpeg',     'IMG'],
    ['scan.tiff',     'IMG'],
    ['unknown.csv',   'PDF'],   // fallback
  ])('infers %s → %s', (filename, expected) => {
    expect(inferFileType(filename)).toBe(expected);
  });
});

describe('formatDate', () => {
  it('formats an ISO string to a locale short date', () => {
    const result = formatDate('2025-07-15', 'en-US');
    expect(result).toMatch(/Jul/);
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/15/);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => expect(clamp(5, 0, 10)).toBe(5));
  it('clamps to min',                  () => expect(clamp(-5, 0, 10)).toBe(0));
  it('clamps to max',                  () => expect(clamp(15, 0, 10)).toBe(10));
});

describe('stringToColour', () => {
  it('returns a valid hsl() string', () => {
    const colour = stringToColour('hello');
    expect(colour).toMatch(/^hsl\(\d+, 60%, 45%\)$/);
  });

  it('is deterministic for the same input', () => {
    expect(stringToColour('test')).toBe(stringToColour('test'));
  });

  it('produces different colours for different inputs', () => {
    expect(stringToColour('aaa')).not.toBe(stringToColour('zzz'));
  });
});
