import NewThread from '../../Domains/threads/entities/NewThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // 1. Validasi input menggunakan Entity NewThread
    const newThread = new NewThread(useCasePayload);

    // 2. Simpan ke database melalui repository dan kembalikan hasilnya
    return this._threadRepository.addThread(newThread);
  }
}

export default AddThreadUseCase;