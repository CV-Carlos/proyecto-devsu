import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeNull();
  });

  it('should be visible when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('should display custom title', () => {
    component.isOpen = true;
    component.title = 'Custom Title';
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.modal-header h3');
    expect(title.textContent).toBe('Custom Title');
  });

  it('should display custom message', () => {
    component.isOpen = true;
    component.message = 'Custom message text';
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.modal-body p');
    expect(message.textContent).toBe('Custom message text');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.btn-confirm');
    confirmButton.click();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const cancelButton = fixture.nativeElement.querySelector('.btn-cancel');
    cancelButton.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not emit events when processing', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    component.isOpen = true;
    component.isProcessing = true;

    component.onConfirm();
    component.onCancel();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it('should disable buttons when processing', () => {
    component.isOpen = true;
    component.isProcessing = true;
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.btn-confirm');
    const cancelButton = fixture.nativeElement.querySelector('.btn-cancel');

    expect(confirmButton.disabled).toBe(true);
    expect(cancelButton.disabled).toBe(true);
  });

  it('should show processing text on confirm button', () => {
    component.isOpen = true;
    component.isProcessing = true;
    component.confirmText = 'Delete';
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmButton.textContent.trim()).toContain('Eliminando...');
  });

  it('should emit cancel when backdrop is clicked', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.isOpen = true;
    component.isProcessing = false;

    const mockEvent = {
      target: document.createElement('div'),
      currentTarget: document.createElement('div')
    } as any;

    mockEvent.target = mockEvent.currentTarget;

    component.onBackdropClick(mockEvent);

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not emit cancel when backdrop is clicked while processing', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.isOpen = true;
    component.isProcessing = true;

    const mockEvent = {
      target: document.createElement('div'),
      currentTarget: document.createElement('div')
    } as any;

    mockEvent.target = mockEvent.currentTarget;

    component.onBackdropClick(mockEvent);

    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it('should use default texts', () => {
    component.isOpen = true;
    fixture.detectChanges();

    expect(component.title).toBe('Eliminar producto');
    expect(component.confirmText).toBe('Confirmar');
    expect(component.cancelText).toBe('Cancelar');
  });
});
