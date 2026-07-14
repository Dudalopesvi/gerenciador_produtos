
import Fastify from 'fastify'
import { Pool } from 'pg'
const servidor = Fastify()
const sql = new Pool({
    user: 'postgres',
    password: 'senai',
    host: 'localhost',
    port: 5432,
    database: 'produtos_db'
})

servidor.get('/', () => {
    return 'Olá! A API de produtos está funcionando corretamente.'
})
// Listar todas as categorias
servidor.get('/categorias', async (request, reply) => {
    const resultado = await sql.query('SELECT * FROM categorias ORDER BY id')
    return resultado.rows
})
// Cadastrar nova categoria
servidor.post('/categorias', async (request, reply) => {
    const { nome, descricao } = request.body
    if (!nome) {
        return reply.status(400).send({
            error: 'O nome da categoria é obrigatório!'
        })
    }
    await sql.query(
        'INSERT INTO categorias (nome, descricao) VALUES ($1, $2)',
        [nome, descricao]
    )
    return reply.status(201).send({
        mensagem: 'Categoria cadastrada com sucesso!'
    })
})
// Editar uma categoria
servidor.put('/categorias/:id', async (request, reply) => {
    const { id } = request.params
    const { nome, descricao } = request.body

    if (!nome) {
        return reply.status(400).send({
            error: 'O nome da categoria é obrigatório!'
        })
    }
    const busca = await sql.query(
        'SELECT * FROM categorias WHERE id = $1',
        [id]
    )
    if (busca.rows.length === 0) {
        return reply.status(404).send({
            error: 'Categoria não encontrada!'
        })
    }
    await sql.query(
        'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3',
        [nome, descricao, id]
    )
    return {
        mensagem: 'Categoria alterada com sucesso!'
    }
})
// Deletar uma categoria
servidor.delete('/categorias/:id', async (request, reply) => {
    const { id } = request.params
    const busca = await sql.query(
        'SELECT * FROM categorias WHERE id = $1',
        [id]
    )
    if (busca.rows.length === 0) {
        return reply.status(404).send({
            error: 'Categoria não encontrada!'
        })
    }
    await sql.query(
        'DELETE FROM categorias WHERE id = $1',
        [id]
    )
    return reply.status(204).send()

})

// Listar todas as categorias
servidor.get('/produtos', async (request, reply) => {
    const resultado = await sql.query('SELECT * FROM Produtos ORDER BY id')
    return resultado.rows
})
// Cadastrar novo produto
servidor.post('/produtos', async (request, reply) => {
    const { nome, preco, quantidade,categoria } = request.body
    if (!nome) {
        return reply.status(400).send({
            error: 'O nome do produto é obrigatório!'
        })
    }
    
    // post da tabela produto
    await sql.query(
        'INSERT INTO produtos (nome, preco, quantidade,categoria) VALUES ($1, $2, $3,$4)',
        [nome, preco, quantidade,categoria]
    )
    
    return reply.status(201).send({
        mensagem: 'produto cadastrado com sucesso!'
    })
})
servidor.put('/produtos/:id', async (request, reply) => {
    const { id } = request.params; // L118: A variável 'id' recebe o valor da URL (ex: 15)
    // Captura os 4 campos do corpo da requisição
    const { nome, preco, quantidade, categoria } = request.body;

    // Validação simples do nome
    if (!nome) {
        return reply.status(400).send({
            error: 'O nome do produto é obrigatório!'
        });
    }

    try {
        // Verifica se o produto existe antes de tentar atualizar
        // L123: Correção: Usando o nome da variável 'id', sem dois pontos
        const busca = await sql.query(
            'SELECT * FROM produtos WHERE id = $1',
            [id] 
        );

        if (busca.rows.length === 0) {
            return reply.status(404).send({
                error: 'produto não encontrado!'
            });
        }

        // UPDATE corrigido: $1 até $5 para os 5 parâmetros
        // L131: Correção: Usando o nome da variável 'id' corretamente aqui também
        await sql.query(
            'UPDATE produtos SET nome = $2, preco = $3, quantidade = $4, categoria = $5 WHERE id = $1',
            [id, nome, preco, quantidade, categoria]
        );

        return reply.send({
            mensagem: 'produto alterado com sucesso!'
        });
    } catch (error) {
        // Exibe o erro no terminal para você saber o que aconteceu
        console.error('Erro ao editar produto:', error);
        return reply.status(500).send({ error: 'Erro interno do servidor ao editar produto.' });
    }
});
// Deletar uma categoria
servidor.delete('/produtos/:id', async (request, reply) => {
    const { id } = request.params
    const busca = await sql.query(
        'SELECT * FROM produtos WHERE id = $1',
        [id]
    )
    if (busca.rows.length === 0) {
        return reply.status(404).send({
            error: 'produto não encontrado!'
        })
    }
    await sql.query(
        'DELETE FROM produtos WHERE id =$1 ',
        [id]
    )
    return reply.status(204).send()

})
// O aluno deverá criar as rotas de produtos abaixo
servidor.listen({
    port: 3000
})
