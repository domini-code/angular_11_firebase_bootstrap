import { DataService } from './services/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [DataService]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  private isEmail = /\S+@\S+\.\S+/;

  constructor(private fb: FormBuilder, private dataSvc: DataService) { }

  ngOnInit(): void {
    this.initForm();
  }

  async onSave(): Promise<void> {
    if (this.contactForm.valid) {
      try {
        const formValue = this.contactForm.value;
        await this.dataSvc.onSaveContact(formValue);
        Swal.fire('Message sent!!', 'See soon!', 'success');
        this.contactForm.reset();
      } catch (e) {
        alert(e);
      }
    } else {
      Swal.fire(
        'Oops.....',
        'Please check the form data',
        'error'
      );
    }
  }

  notRequiredHasValue(field: string): string {
    return this.contactForm.get(field).value ? 'is-valid' : '';
  }


  isValidField(field: string): string {
    const validatedField = this.contactForm.get(field);
    return (!validatedField.valid && validatedField.touched)
      ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    });
  }
}
