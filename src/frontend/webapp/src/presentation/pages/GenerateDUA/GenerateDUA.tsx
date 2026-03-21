import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useFileDetection } from '../../hooks/useFileDetection';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../../security/rbac/permissions';
import Button from '../../components/atoms/Button/Button';
import StageProgressBar from '../../components/molecules/StageProgressBar';
import FileListItem from '../../components/molecules/FileListItem';
import DUAFieldsPanel from '../../components/organisms/DUAFieldsPanel';
import EvidencePanel from '../../components/organisms/EvidencePanel';
import IssueCard from '../../components/molecules/IssueCard';
import styles from './GenerateDUA.module.css';

const GenerateDUA: React.FC = () => {
  const { t } = useTranslation();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const { files: detectedFiles, handleFolderSelect, clearFiles } = useFileDetection();
  const workflow = useWorkflow();
  const duaDocument   = useAppSelector((s) => s.dua.document);
  const issues        = useAppSelector((s) => s.dua.issues);
  const canDownload   = usePermission(PERMISSIONS.DOWNLOAD_DUA);

  const isIdle       = workflow.stage === 'idle';
  const isProcessing = workflow.isRunning;
  const isReview     = workflow.isComplete || !!duaDocument;

  const handleAnalyze = () => {
    if (detectedFiles.length === 0) return;
    workflow.analyze(detectedFiles);
  };

  /* ── Idle: folder selection screen ──────────────────────── */
  if (isIdle && !duaDocument) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{t('home.title')}</h1>
          <p className={styles.heroSub}>
            Select a folder of documents to extract and review a DUA.
          </p>

          <div className={styles.uploadCard}>
            <input
              ref={folderInputRef}
              type="file"
              multiple
              className={styles.hiddenInput}
              onChange={handleFolderSelect}
              // @ts-expect-error — non-standard but widely supported
              webkitdirectory=""
            />
            <Button
              size="lg"
              onClick={() => folderInputRef.current?.click()}
              icon={<span>📁</span>}
            >
              {t('home.selectFolder')}
            </Button>

            {detectedFiles.length > 0 && (
              <>
                <div className={styles.fileListHeader}>
                  <span className={styles.fileCount}>
                    {detectedFiles.length} {t('home.detectedFiles')}
                  </span>
                  <button className={styles.clearBtn} onClick={clearFiles}>
                    Clear
                  </button>
                </div>
                <ul className={styles.fileList}>
                  {detectedFiles.map((f) => (
                    <FileListItem key={f.name} file={f} />
                  ))}
                </ul>
                <Button size="lg" onClick={handleAnalyze} icon={<span>🔍</span>}>
                  {t('home.analyze')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Processing screen ───────────────────────────────────── */
  if (isProcessing) {
    return (
      <div className={styles.page}>
        <div className={styles.processingCard}>
          <h2 className={styles.processingTitle}>Processing your documents…</h2>
          <StageProgressBar
            currentStage={workflow.stage}
            progress={workflow.progress}
          />

          <div className={styles.logBox}>
            {workflow.logs.map((log, i) => (
              <div key={i} className={styles.logEntry}>
                <span className={styles.logTime}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span>{log.message}</span>
              </div>
            ))}
            {workflow.logs.length === 0 && (
              <span className={styles.logEmpty}>Waiting for updates…</span>
            )}
          </div>

          {workflow.files.length > 0 && (
            <ul className={styles.fileList}>
              {workflow.files.map((f) => (
                <FileListItem key={f.name} file={f} />
              ))}
            </ul>
          )}

          <div className={styles.processingActions}>
            <Button variant="secondary" onClick={workflow.cancel}>
              {t('workflow.cancelJob')}
            </Button>
            {workflow.isFailed && (
              <Button variant="danger" onClick={workflow.retryOCR}>
                {t('workflow.retryOCR')}
              </Button>
            )}
          </div>

          {workflow.error && (
            <p className={styles.errorBanner}>⛔ {workflow.error}</p>
          )}
        </div>
      </div>
    );
  }

  /* ── DUA Review screen ───────────────────────────────────── */
  if (isReview) {
    const openIssues = issues.filter((i) => i.status === 'open');
    const greenCount  = issues.filter((i) => i.status === 'reviewed').length;
    const totalFields = duaDocument?.sections.flatMap((s) => s.fields).length ?? 0;

    return (
      <div className={styles.reviewShell}>
        {/* Top bar */}
        <div className={styles.reviewTopBar}>
          <h1 className={styles.reviewTitle}>{t('dua.title')}</h1>
          <div className={styles.reviewActions}>
            {openIssues.length > 0 && (
              <span className={styles.issuePill}>
                ⚠️ {openIssues.length} open issue{openIssues.length !== 1 ? 's' : ''}
              </span>
            )}
            <span className={styles.fieldSummary}>
              {totalFields} fields · {greenCount} reviewed
            </span>
            {canDownload && (
              <Button onClick={workflow.generateWord} icon={<span>📄</span>}>
                {t('dua.generateWord')}
              </Button>
            )}
          </div>
        </div>

        <div className={styles.reviewBody}>
          {/* Left: DUA fields */}
          <div className={styles.fieldsCol}>
            <DUAFieldsPanel />
          </div>

          {/* Right: Evidence + Issues */}
          <div className={styles.rightCol}>
            <EvidencePanel />

            {issues.length > 0 && (
              <div className={styles.issuesSection}>
                <h3 className={styles.issuesTitle}>{t('issues.title')}</h3>
                <div className={styles.issuesList}>
                  {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GenerateDUA;
