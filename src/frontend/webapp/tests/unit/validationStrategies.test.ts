import { runValidation } from '../../src/application/validation/validationStrategies';
import type { DUADocument } from '../../src/domain/dua/DUATypes';

const makeDoc = (overrides: Partial<DUADocument> = {}): DUADocument => ({
  id: 'doc-1',
  jobId: 'job-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sections: [
    {
      key: 'financial',
      label: 'Financial',
      fields: [
        {
          id: 'f-subtotal', label: 'Subtotal', value: 'USD 1000',
          aiSuggestion: 'USD 1000', confidence: 'green',
          confidenceScore: 95, confidenceReason: '', evidence: [], isEdited: false,
        },
        {
          id: 'f-tax', label: 'Tax', value: 'USD 100',
          aiSuggestion: 'USD 100', confidence: 'green',
          confidenceScore: 95, confidenceReason: '', evidence: [], isEdited: false,
        },
        {
          id: 'f-total', label: 'Total', value: 'USD 1100',
          aiSuggestion: 'USD 1100', confidence: 'green',
          confidenceScore: 95, confidenceReason: '', evidence: [], isEdited: false,
        },
      ],
    },
    {
      key: 'dates',
      label: 'Dates',
      fields: [
        {
          id: 'd-start', label: 'Start Date', value: '2025-01-15',
          aiSuggestion: '2025-01-15', confidence: 'green',
          confidenceScore: 90, confidenceReason: '', evidence: [], isEdited: false,
        },
      ],
    },
  ],
  ...overrides,
});

describe('runValidation', () => {
  it('returns no issues for a clean document', () => {
    const issues = runValidation(makeDoc());
    expect(issues).toHaveLength(0);
  });

  it('detects currency mismatch', () => {
    const doc = makeDoc();
    doc.sections[0].fields[2].value = 'EUR 1100'; // different currency
    const issues = runValidation(doc);
    expect(issues.some((i) => i.message.includes('Inconsistent currencies'))).toBe(true);
  });

  it('detects totals mismatch', () => {
    const doc = makeDoc();
    doc.sections[0].fields[2].value = 'USD 999'; // wrong total
    const issues = runValidation(doc);
    expect(issues.some((i) => i.fieldId === 'f-total')).toBe(true);
  });

  it('detects invalid date format', () => {
    const doc = makeDoc();
    doc.sections[1].fields[0].value = '15/01/2025'; // non-ISO format
    const issues = runValidation(doc);
    expect(issues.some((i) => i.severity === 'warning' && i.fieldId === 'd-start')).toBe(true);
  });

  it('assigns each issue a unique id and open status', () => {
    const doc = makeDoc();
    doc.sections[0].fields[2].value = 'USD 999';
    const issues = runValidation(doc);
    const ids = issues.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    issues.forEach((i) => expect(i.status).toBe('open'));
  });
});
