// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';

type Props = {
  filePath: string | WebFile,
  optimize: boolean,
  title: ?string,
  channel: ?string,
  bid: ?number,
  uri: ?string,
  contentIsFree: boolean,
  fee: {
    amount: string,
    currency: string,
  },
  isVid: boolean,
  ffmpegStatus: any,
  previewResponse: PublishResponse,
  publish: (?string, ?boolean) => void,
  closeModal: () => void,
  enablePublishPreview: boolean,
  setEnablePublishPreview: boolean => void,
  isStillEditing: boolean,
};

class ModalPublishPreview extends React.PureComponent<Props> {
  onConfirmed() {
    const { filePath, publish, closeModal } = this.props;
    // Publish for real:
    publish(this.resolveFilePathName(filePath), false);
    closeModal();
  }

  resolveFilePathName(filePath: string | WebFile) {
    if (!filePath) {
      return '---';
    }

    if (typeof filePath === 'string') {
      return filePath;
    } else {
      return filePath.name;
    }
  }

  createRow(label: string, value: any) {
    return (
      <tr>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    );
  }

  togglePreviewEnabled() {
    const { enablePublishPreview, setEnablePublishPreview } = this.props;
    setEnablePublishPreview(!enablePublishPreview);
  }

  render() {
    const {
      filePath,
      optimize,
      title,
      channel,
      bid,
      uri,
      contentIsFree,
      fee,
      isVid,
      ffmpegStatus = {},
      previewResponse,
      closeModal,
      enablePublishPreview,
      setEnablePublishPreview,
      isStillEditing,
    } = this.props;

    const modalTitle = isStillEditing ? __('Confirm Edit') : __('Confirm Publish');
    const confirmBtnText = isStillEditing ? __('Save') : __('Publish');
    const txFee = previewResponse ? previewResponse['total_fee'] : null;
    const isOptimizeAvail = filePath && filePath !== '' && isVid && ffmpegStatus.available;

    return (
      <Modal isOpen contentLabel={modalTitle} type="card" onAborted={closeModal}>
        <Form onSubmit={() => this.onConfirmed()}>
          <Card
            title={modalTitle}
            body={
              <>
                <div className="section">
                  <table className="table table--condensed table--publish-preview">
                    <tbody>
                      {this.createRow(__('Title'), title)}
                      {this.createRow(__('Channel'), channel)}
                      {this.createRow(__('URL'), uri)}
                      {this.createRow(__('Deposit'), bid ? `${bid} LBC` : '---')}
                      {this.createRow(__('Price'), contentIsFree ? __('Free') : `${fee.amount} ${fee.currency}`)}
                      {isOptimizeAvail && this.createRow(__('Transcode'), optimize ? __('Yes') : __('No'))}
                    </tbody>
                  </table>
                </div>
                {txFee && (
                  <div className="section" aria-label={__('Estimated transaction fee:')}>
                    <b>{__('Est. transaction fee:')}</b>&nbsp;&nbsp;<em>{txFee}</em> LBC
                  </div>
                )}
              </>
            }
            actions={
              <>
                <div className="section__actions">
                  <Button autoFocus button="primary" label={confirmBtnText} onClick={() => this.onConfirmed()} />
                  <Button button="link" label={__('Cancel')} onClick={closeModal} />
                </div>
                <p className="help">{__('Once the transaction is sent, it cannot be reversed.')}</p>
                <FormField
                  type="checkbox"
                  name="sync_toggle"
                  label={__('Skip preview and confirmation')}
                  checked={!enablePublishPreview}
                  onChange={() => setEnablePublishPreview(!enablePublishPreview)}
                />
              </>
            }
          />
        </Form>
      </Modal>
    );
  }
}

export default ModalPublishPreview;
