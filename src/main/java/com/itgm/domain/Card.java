package com.itgm.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Card.
 */
@Entity
@Table(name = "card")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Card implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "url")
    private String url;

    @Column(name = "meta")
    private String meta;

    @Column(name = "disposicao")
    private String disposicao;

    @Column(name = "tipo")
    private Integer tipo;

    @Column(name = "modo")
    private String modo;

    @ManyToOne
    private Customize customize;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public Card nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUrl() {
        return url;
    }

    public Card url(String url) {
        this.url = url;
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMeta() {
        return meta;
    }

    public Card meta(String meta) {
        this.meta = meta;
        return this;
    }

    public void setMeta(String meta) {
        this.meta = meta;
    }

    public String getDisposicao() {
        return disposicao;
    }

    public Card disposicao(String disposicao) {
        this.disposicao = disposicao;
        return this;
    }

    public void setDisposicao(String disposicao) {
        this.disposicao = disposicao;
    }

    public Integer getTipo() {
        return tipo;
    }

    public Card tipo(Integer tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(Integer tipo) {
        this.tipo = tipo;
    }

    public String getModo() {
        return modo;
    }

    public Card modo(String modo) {
        this.modo = modo;
        return this;
    }

    public void setModo(String modo) {
        this.modo = modo;
    }

    public Customize getCustomize() {
        return customize;
    }

    public Card customize(Customize customize) {
        this.customize = customize;
        return this;
    }

    public void setCustomize(Customize customize) {
        this.customize = customize;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Card card = (Card) o;
        if (card.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, card.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Card{" +
            "id=" + id +
            ", nome='" + nome + "'" +
            ", url='" + url + "'" +
            ", meta='" + meta + "'" +
            ", disposicao='" + disposicao + "'" +
            ", tipo='" + tipo + "'" +
            ", modo='" + modo + "'" +
            '}';
    }
}
