import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './CadastroQuestao.css';

const CadastroQuestao = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [questao, setQuestao] = useState({
    materia: '',
    topico: '',
    nivelDificuldade: 'FACIL',
    pontuacao: 1,
    enunciado: '',
    tipoQuestao: 'MULTIPLA_ESCOLHA',
    alternativas: [
      { letra: 'A', textoAlternativa: '', correta: false },
      { letra: 'B', textoAlternativa: '', correta: false },
    ],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarMaterias();
  }, []);

  const carregarMaterias = async () => {
    try {
      const response = await api.get('/professor/materias');
      setMaterias(response.data);
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    }
  };

  const handleChange = (e) => {
    setQuestao({
      ...questao,
      [e.target.name]: e.target.value,
    });
  };

  const handleAlternativaChange = (index, value) => {
    const novasAlternativas = [...questao.alternativas];
    novasAlternativas[index].textoAlternativa = value;
    setQuestao({ ...questao, alternativas: novasAlternativas });
  };

  const handleCorretaChange = (index) => {
    const novasAlternativas = questao.alternativas.map((alt, i) => ({
      ...alt,
      correta: i === index,
    }));
    setQuestao({ ...questao, alternativas: novasAlternativas });
  };

  const adicionarAlternativa = () => {
    const letra = String.fromCharCode(65 + questao.alternativas.length);
    setQuestao({
      ...questao,
      alternativas: [
        ...questao.alternativas,
        { letra, textoAlternativa: '', correta: false },
      ],
    });
  };

  const removerAlternativa = (index) => {
    if (questao.alternativas.length <= 2) {
      alert('A questão deve ter no mínimo 2 alternativas');
      return;
    }
    const novasAlternativas = questao.alternativas.filter((_, i) => i !== index);
    setQuestao({ ...questao, alternativas: novasAlternativas });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (questao.alternativas.length < 2) {
      setError('A questão deve ter no mínimo 2 alternativas');
      return;
    }

    const alternativasPreenchidas = questao.alternativas.filter(
      (alt) => alt.textoAlternativa.trim() !== ''
    );

    if (alternativasPreenchidas.length < 2) {
      setError('Preencha no mínimo 2 alternativas');
      return;
    }

    setLoading(true);

    try {
      await api.post('/professor/questoes', questao);
      navigate('/professor/questoes');
    } catch (err) {
      setError('Erro ao cadastrar questão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container cadastro-questao-container">
        <div className="cadastro-questao-header">
          <h1>Cadastrar Nova Questão</h1>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/professor/questoes')}
          >
            <i className="fas fa-arrow-left"></i> Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="questao-form card">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="materia">Matéria *</label>
              <select
                id="materia"
                name="materia"
                className="input"
                value={questao.materia}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma matéria</option>
                {materias.map((mat) => (
                  <option key={mat.id} value={mat.nome}>
                    {mat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topico">Tópico (Opcional)</label>
              <input
                type="text"
                id="topico"
                name="topico"
                className="input"
                value={questao.topico}
                onChange={handleChange}
                placeholder="Ex: Derivadas, Pilhas..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nivelDificuldade">Nível de Dificuldade *</label>
              <select
                id="nivelDificuldade"
                name="nivelDificuldade"
                className="select"
                value={questao.nivelDificuldade}
                onChange={handleChange}
              >
                <option value="FACIL">Fácil</option>
                <option value="MEDIO">Médio</option>
                <option value="DIFICIL">Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pontuacao">Pontuação *</label>
              <input
                type="number"
                id="pontuacao"
                name="pontuacao"
                className="input"
                value={questao.pontuacao}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="enunciado">Enunciado *</label>
            <textarea
              id="enunciado"
              name="enunciado"
              className="textarea"
              value={questao.enunciado}
              onChange={handleChange}
              placeholder="Digite o enunciado da questão..."
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Questão *</label>
            <select
              name="tipoQuestao"
              className="select"
              value={questao.tipoQuestao}
              onChange={handleChange}
            >
              <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
            </select>
          </div>

          <div className="alternativas-section">
            <div className="alternativas-header">
              <h3>Alternativas</h3>
              <p className="alternativas-hint">Selecione a alternativa correta</p>
            </div>

            {questao.alternativas.map((alternativa, index) => (
              <div key={index} className="alternativa-item">
                <input
                  type="radio"
                  name="correta"
                  checked={alternativa.correta}
                  onChange={() => handleCorretaChange(index)}
                  className="alternativa-radio"
                />
                <div className="alternativa-letra">{alternativa.letra}</div>
                <input
                  type="text"
                  className="input alternativa-input"
                  value={alternativa.textoAlternativa}
                  onChange={(e) => handleAlternativaChange(index, e.target.value)}
                  placeholder={`Texto da Alternativa ${alternativa.letra}`}
                />
                {questao.alternativas.length > 2 && (
                  <button
                    type="button"
                    className="btn-icon btn-danger"
                    onClick={() => removerAlternativa(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-add-alternativa"
              onClick={adicionarAlternativa}
            >
              <i className="fas fa-plus"></i> Adicionar Alternativa
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/professor/questoes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Questão'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CadastroQuestao;
