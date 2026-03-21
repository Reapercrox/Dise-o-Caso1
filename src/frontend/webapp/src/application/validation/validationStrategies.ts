import type { DUADocument } from '../../domain/dua/DUATypes';
import type { ValidationIssue } from '../../domain/dua/duaSlice';
import { v4 as uuidv4 } from 'uuid';

type ValidationStrategy = (
  doc: DUADocument
) => Omit<ValidationIssue, 'id' | 'status'>[];

/** Strategy: detect currency field mismatches */
const currencyMismatchStrategy: ValidationStrategy = (doc) => {
  const issues: Omit<ValidationIssue, 'id' | 'status'>[] = [];

  const financialSection = doc.sections.find((s) => s.key === 'financial');
  if (!financialSection) return issues;

  const currencies = new Set(
    financialSection.fields
      .map((f) => {
        const match = f.value.match(/[A-Z]{3}/);
        return match ? match[0] : null;
      })
      .filter(Boolean)
  );

  if (currencies.size > 1) {
    issues.push({
      fieldId: 'financial',
      severity: 'error',
      message: `Inconsistent currencies detected: ${[...currencies].join(', ')}`,
    });
  }

  return issues;
};

/** Strategy: validate date formats and logical order */
const dateValidationStrategy: ValidationStrategy = (doc) => {
  const issues: Omit<ValidationIssue, 'id' | 'status'>[] = [];

  const datesSection = doc.sections.find((s) => s.key === 'dates');
  if (!datesSection) return issues;

  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  datesSection.fields.forEach((field) => {
    if (field.value && !isoRegex.test(field.value)) {
      issues.push({
        fieldId: field.id,
        severity: 'warning',
        message: `Field "${field.label}" has a non-standard date format: "${field.value}"`,
      });
    }
  });

  return issues;
};

/** Strategy: check totals consistency */
const totalsMismatchStrategy: ValidationStrategy = (doc) => {
  const issues: Omit<ValidationIssue, 'id' | 'status'>[] = [];

  const financialSection = doc.sections.find((s) => s.key === 'financial');
  if (!financialSection) return issues;

  const subtotal = financialSection.fields.find((f) =>
    f.label.toLowerCase().includes('subtotal')
  );
  const total = financialSection.fields.find((f) =>
    f.label.toLowerCase() === 'total'
  );
  const tax = financialSection.fields.find((f) =>
    f.label.toLowerCase().includes('tax')
  );

  if (subtotal && total && tax) {
    const sub = parseFloat(subtotal.value.replace(/[^0-9.]/g, ''));
    const tx = parseFloat(tax.value.replace(/[^0-9.]/g, ''));
    const tot = parseFloat(total.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(sub) && !isNaN(tx) && !isNaN(tot)) {
      if (Math.abs(sub + tx - tot) > 0.01) {
        issues.push({
          fieldId: total.id,
          severity: 'error',
          message: `Total (${tot}) does not match subtotal + tax (${sub + tx})`,
        });
      }
    }
  }

  return issues;
};

const strategies: ValidationStrategy[] = [
  currencyMismatchStrategy,
  dateValidationStrategy,
  totalsMismatchStrategy,
];

/** Run all strategies and return a flat list of issues */
export const runValidation = (doc: DUADocument): ValidationIssue[] => {
  return strategies.flatMap((strategy) =>
    strategy(doc).map((issue) => ({
      ...issue,
      id: uuidv4(),
      status: 'open' as const,
    }))
  );
};
